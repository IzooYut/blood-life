<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecipientRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'blood_group_id' => 'required|exists:blood_groups,id',
            'date_of_birth' => 'nullable',
            'hospital_id' => 'nullable|exists:hospitals,id',
            'id_number' => 'nullable|string|max:255',
            'gender' => 'required',
            'medical_notes' => 'nullable'
        ];
    }
}
