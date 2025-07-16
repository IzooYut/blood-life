<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHospitalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
                $hospitalId = $this->route('hospital');
        return [
             'name' => 'required|string|unique:hospitals,name,' . $hospitalId,
            'logo' => 'nullable|string',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'phone' => 'nullable|string|unique:hospitals,phone,' . $hospitalId,
            'email' => 'nullable|email|unique:hospitals,email,' . $hospitalId,
        ];
    }
}
