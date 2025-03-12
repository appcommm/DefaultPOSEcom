<?php

namespace App\Http\Requests\Dashboard\API;

use App\Rules\CheckCustomerEmailAndPhone;
use App\Rules\IsBannedCustomer;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'emailOrPhone' => ['required','max:255',new CheckCustomerEmailAndPhone(),new IsBannedCustomer(),],
            'password' => 'required|max:255',
            'fcm_token_key' => 'required',
        ];
    }
}
