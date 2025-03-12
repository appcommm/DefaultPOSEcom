<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeliveryFeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->delivery_fee) {
            return [
                'region_id' => 'required|exists:regions,id',
                'city' => 'required|max:255|unique:delivery_fees,city,' . $this->delivery_fee->id . ',id,deleted_at,NULL',
                'fee' => 'required|numeric',
            ];
        } else {
            return [
                'region_id' => 'required|exists:regions,id',
                'city' => 'required|max:255|unique:delivery_fees,city,NULL,id,deleted_at,NULL',
                'fee' => 'required|numeric',
            ];
        }
    }
}
