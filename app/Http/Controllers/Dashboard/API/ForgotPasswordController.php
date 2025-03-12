<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\API\ForgotPasswordRequest;
use App\Http\Requests\Dashboard\API\VerifyForgotPassword;
use App\Mail\ForgotPasswordMail;
use App\Models\Customer;
use App\Traits\HttpResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends BaseController
{

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $customer = Customer::where('email', $request->email)->first();
        if (!$customer) {
            return $this->sendError(404, 'User not found with this email.');
        }

        $code = random_int(100000, 999999);
        $customer->forgotPassword()->create([
            'email' => $request->email,
            'code' => $code
        ]);

        Mail::to($customer->email)->send(new ForgotPasswordMail($code));
        return $this->sendResponse('Reset password code sent to your email.', []);
    }

    public function verifyForgotPasswordCode(VerifyForgotPassword $request)
    {
        $customer = Customer::where('email', $request->email)->first();
        $forgotPassword = $customer->forgotPassword()
            ->where('code', $request->code)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->first();
        if (!$forgotPassword) {
            return $this->sendError(400, 'Invalid code.');
        }

        $forgotPassword->is_verified = true;
        $forgotPassword->verified_at = now();
        $forgotPassword->save();

        return $this->sendResponse('Code verified successfully.', []);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);
        $customer = Customer::where('email', $request->email)->first();
        if (!$customer) {
            return $this->sendError(404, 'User not found with this email.');
        }

        $forgotPassword = $customer->forgotPassword()
            ->where('is_verified', true)
            ->where('verified_at', '>=', now()->subMinutes(5))
            ->first();
        if (!$forgotPassword) {
            return $this->sendError(400, 'Verify your code first!');
        }

        $forgotPassword->delete();

        $customer->password = Hash::make($request->password);
        $customer->save();

        return $this->sendResponse('Password updated successfully.', []);
    }
}
