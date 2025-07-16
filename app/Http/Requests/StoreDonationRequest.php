<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonationRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'blood_center_id' => 'required|exists:blood_centers,id',
            'blood_group_id' => 'required|exists:blood_groups,id',
            'volume_ml' => 'required|integer|min:100|max:1000',
            'donation_date' => 'required|date|before_or_equal:today',
            'screening_status' => 'in:not_screened,passed,failed',
            'notes' => 'nullable|string',
        ];
    }
}
