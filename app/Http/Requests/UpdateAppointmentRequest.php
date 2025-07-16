<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
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
            'user_id' => 'sometimes|exists:users,id',
            'blood_center_id' => 'sometimes|exists:blood_centers,id',
            'blood_group_id' => 'sometimes|exists:blood_groups,id',
            'appointment_date' => 'sometimes|date|after_or_equal:today',
            'status' => 'nullable|in:pending,accepted,rejected',
            'notes' => 'nullable|string',
        ];
    }
}
