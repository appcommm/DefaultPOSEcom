<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StoreRegionRequest extends FormRequest
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
        if ($this->region) {
            return [
                'name' => 'required|max:255|unique:regions,name,'.$this->region->id.',id,deleted_at,NULL',
            ];
        } else {
            return [
                'name' => 'required|max:255|unique:regions,name,NULL,id,deleted_at,NULL',
            ];
        }
    }
}
