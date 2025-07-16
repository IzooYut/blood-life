<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonorRequest extends FormRequest
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
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'gender' => ['required', 'in:male,female,other'],
            'dob' => ['required', 'date', 'before:today'],
            'phone' => ['required', 'string', 'regex:/^\+?[0-9\s\-]{7,15}$/'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'blood_group_id' => ['required', 'exists:blood_groups,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'blood_group_id.required' => 'The blood group field is required.',
            'blood_group_id.exists' => 'The selected blood group is invalid.',
            'dob.before' => 'Date of birth must be in the past.',
        ];
    }
}
