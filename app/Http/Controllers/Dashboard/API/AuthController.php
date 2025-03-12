<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Http\Requests\Dashboard\API\RegisterRequest;
use App\Http\Requests\Dashboard\API\LoginRequest;
use App\Http\Resources\Dashboard\CustomerResource;
use App\Models\Customer;
use App\Models\FcmTokenKey;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends BaseController
{
    //login
    public function login(LoginRequest $request)
    {
        if (Auth::guard('mobile')->user()) {
            return $this->sendError(401, 'Already login!');
        }

        $customer = Customer::withCount('fcmTokenKey')->orWhere('email', $request->emailOrPhone)->orWhere('phone', $request->emailOrPhone)->first();
        if ($customer->fcm_token_key_count >= 5) {
            $firstFcmTokenKey = FcmTokenKey::where('customer_id', $customer->id)->first();
            $firstFcmTokenKey->update([$request->fcm_token_key]);
        } else {
            FcmTokenKey::create([
                'customer_id' => $customer->id,
                'fcm_token_key' => $request->fcm_token_key,
            ]);
        }
        $hashPassword = $customer->password;
        if (Hash::check($request->password, $hashPassword)) {
            return response()->json([
                'success' => true,
                'token' => $customer->createToken(config('app.companyInfo.name'))->plainTextToken,
                'data' => new CustomerResource($customer),
            ], 200);
        } else {
            return $this->sendError(401, 'Crediantials do not match');
        }
    }

    //register
    public function register(RegisterRequest $request)
    {
        if (Auth::guard('mobile')->user()) {
            return $this->sendError(401, 'Already login!');
        }

        $data = $this->getCustomerRequestData($request);
        $customer = Customer::create($data);
        FcmTokenKey::create([
            'customer_id' => $customer->id,
            'fcm_token_key' => $request->fcm_token_key,
        ]);

        if ($customer) {
            return response()->json([
                'success' => true,
                'token' => $customer->createToken('MYAPP')->plainTextToken,
                'data' => new CustomerResource($customer),
            ], 200);
        }

        return $this->sendError(401, 'Register Fail! Try Again.');
    }

    //logout
    public function logout()
    {
        $customer = Auth::guard('mobile')->user();
        $customer->tokens()->delete();

        return $this->sendResponse('Logout successfully');
    }


    private function getCustomerRequestData($request)
    {
        $data = [
            'name' => $request->name,
            'country' => $request->country,
            'city' => $request->city,
            'password' => Hash::make($request->password),
            'created_at' => Carbon::now(),
        ];
        if ($request->email) {
            $data['email'] = $request->email;
        }
        if ($request->phone) {
            $data['phone'] = $request->phone;
        }
        if ($request->dob) {
            $data['dob'] = $request->dob;
        }
        if ($request->address) {
            $data['address'] = $request->address;
        }

        return $data;
    }
}
