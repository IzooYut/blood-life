<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
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
            'user_id' => 'nullable|exists:users,id',
            'blood_center_id' => 'required|exists:blood_centers,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'status' => 'nullable|in:pending,accepted,rejected',
            'notes' => 'nullable|string',
            'blood_request_item_id'=>'nullable|exists:blood_request_items,id'
        ];
    }
}
