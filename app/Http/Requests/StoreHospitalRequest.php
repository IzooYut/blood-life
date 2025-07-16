<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHospitalRequest extends FormRequest
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
        return [
            'name' => 'required|string|unique:hospitals,name',
            'contact_person' => 'nullable|string',
            'logo' => 'nullable|string',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'phone' => 'nullable|string|unique:hospitals,phone',
            'email' => 'nullable|email|unique:hospitals,email',
        ];
    }
}
