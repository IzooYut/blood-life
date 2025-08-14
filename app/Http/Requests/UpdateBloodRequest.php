<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Hospital;
use App\Models\BloodRequest;

class UpdateBloodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $bloodRequestId = $this->route('blood_request');
        
        // Get the blood request model
        $bloodRequest = BloodRequest::find($bloodRequestId);
        
        // If blood request doesn't exist, let it fail in the controller
        if (!$bloodRequest) {
            return false;
        }

        $user = Auth::user();
        
        // Hospital staff can only update their own hospital's requests
        if ($user->user_type === "hospital_staff") {
            $hospital = Hospital::where('user_id', $user->id)->first();
            if (!$hospital || $bloodRequest->hospital_id !== $hospital->id) {
                return false;
            }
        }

        // Check if request can be updated based on status
        if (in_array($bloodRequest->status, ['fulfilled', 'cancelled'])) {
            return false;
        }

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
            'hospital_id' => 'required|exists:hospitals,id',
            'request_date' => 'required|date|after_or_equal:today',
            'notes' => 'nullable|string|max:1000',
            
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:blood_request_items,id', // For existing items
            'items.*.blood_group_id' => 'required|exists:blood_groups,id',
            'items.*.units_requested' => 'required|integer|min:1',
            'items.*.urgency' => 'required|in:urgent,normal,low',
            'items.*.recipient_id' => 'nullable|exists:recipients,id',
            'items.*.is_general' => 'required|boolean',
            'items.*.add_new_recipient' => 'sometimes|boolean',
            
            'items.*.recipient_data' => 'required_if:items.*.add_new_recipient,true|array',
            'items.*.recipient_data.name' => 'required_if:items.*.add_new_recipient,true|string|max:255',
            'items.*.recipient_data.id_number' => 'required_if:items.*.add_new_recipient,true|string|max:50',
            'items.*.recipient_data.date_of_birth' => 'required_if:items.*.add_new_recipient,true|date|before:today',
            'items.*.recipient_data.gender' => 'required_if:items.*.add_new_recipient,true|in:male,female,other',
            'items.*.recipient_data.blood_group_id' => 'required_if:items.*.add_new_recipient,true|exists:blood_groups,id',
            'items.*.recipient_data.medical_notes' => 'nullable|string|max:500',
            'items.*.recipient_data.hospital_id' => 'required_if:items.*.add_new_recipient,true|exists:hospitals,id',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($v) {
            $data = $v->getData();
            $items = $data['items'] ?? [];
            
            foreach ($items as $index => $item) {
                // General request must not specify a blood group
                if ($item['is_general'] && !empty($item['blood_group_id'])) {
                    $v->errors()->add("items.$index.blood_group_id", 'General request must not specify a blood group.');
                }

                // Specific request must include a blood group
                if (!$item['is_general'] && empty($item['blood_group_id']) && !isset($item['add_new_recipient'])) {
                    $v->errors()->add("items.$index.blood_group_id", 'Specific request must include a blood group.');
                }
                
                // Validate new recipient data
                if (isset($item['add_new_recipient']) && $item['add_new_recipient'] === true) {
                    if (empty($item['recipient_data']['name'])) {
                        $v->errors()->add("items.$index.recipient_data.name", 'The recipient name is required when adding a new recipient.');
                    }
                    
                    if (empty($item['recipient_data']['blood_group_id'])) {
                        $v->errors()->add("items.$index.recipient_data.blood_group_id", 'The blood group is required when adding a new recipient.');
                    }
                    
                    if (empty($item['recipient_data']['hospital_id'])) {
                        $v->errors()->add("items.$index.recipient_data.hospital_id", 'The hospital is required when adding a new recipient.');
                    }

                    if (empty($item['recipient_data']['gender'])) {
                        $v->errors()->add("items.$index.recipient_data.gender", 'The gender is required when adding a new recipient.');
                    }

                    if (empty($item['recipient_data']['date_of_birth'])) {
                        $v->errors()->add("items.$index.recipient_data.date_of_birth", 'The date of birth is required when adding a new recipient.');
                    }

                    if (empty($item['recipient_data']['id_number'])) {
                        $v->errors()->add("items.$index.recipient_data.id_number", 'The ID number is required when adding a new recipient.');
                    }
                }
                
                // For specific requests, either select existing recipient or add new one
                if (!$item['is_general'] && empty($item['recipient_id']) && (!isset($item['add_new_recipient']) || $item['add_new_recipient'] !== true)) {
                    $v->errors()->add("items.$index.recipient_id", 'Either select an existing recipient or add a new recipient.');
                }
            }
        });
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'hospital_id.required' => 'Please select a hospital.',
            'hospital_id.exists' => 'The selected hospital is invalid.',
            'request_date.required' => 'Request date is required.',
            'request_date.date' => 'Request date must be a valid date.',
            'request_date.after_or_equal' => 'Request date cannot be in the past.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
            'items.required' => 'At least one blood item is required.',
            'items.min' => 'At least one blood item is required.',
            'items.*.blood_group_id.required' => 'Blood group is required.',
            'items.*.blood_group_id.exists' => 'The selected blood group is invalid.',
            'items.*.units_requested.required' => 'Units requested is required.',
            'items.*.units_requested.integer' => 'Units requested must be a number.',
            'items.*.units_requested.min' => 'At least 1 unit must be requested.',
            'items.*.units_requested.max' => 'Cannot request more than 50 units.',
            'items.*.urgency.required' => 'Urgency level is required.',
            'items.*.urgency.in' => 'Invalid urgency level selected.',
            'items.*.is_general.required' => 'Request type (general/specific) is required.',
        ];
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization()
    {
        $bloodRequestId = $this->route('blood_request');
        $bloodRequest = BloodRequest::find($bloodRequestId);
        
        if ($bloodRequest && in_array($bloodRequest->status, ['fulfilled', 'cancelled'])) {
            abort(422, 'This blood request cannot be updated because it has been ' . $bloodRequest->status . '.');
        }
        
        abort(403, 'Unauthorized access to this blood request.');
    }
}