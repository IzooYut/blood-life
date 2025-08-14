<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBloodRequest extends FormRequest
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
            'hospital_id' => 'required|exists:hospitals,id',
            'recipient_id' => 'nullable|exists:recipients,id',
            'request_date' => 'required|date',
            'notes' => 'nullable|string',

            'items' => 'required|array|min:1',
            'items.*.is_general' => 'required|boolean',
            'items.*.blood_group_id' => 'nullable|exists:blood_groups,id',
            'items.*.recipient_id' => 'nullable|exists:recipients,id',
            'items.*.units_requested' => 'required|numeric|min:1',
            'items.*.urgency' => 'required|in:normal,urgent,very_urgent',
            'items.*.add_new_recipient' => 'nullable|boolean',

            'items.*.recipient_data' => 'nullable|array',
            'items.*.recipient_data.name' => 'nullable|string|max:255',
            'items.*.recipient_data.date_of_birth' => 'nullable|date',
            'items.*.recipient_data.gender' => 'nullable|in:male,female,other',
            'items.*.recipient_data.blood_group_id' => 'nullable|exists:blood_groups,id',
            'items.*.recipient_data.medical_notes' => 'nullable|string',
            'items.*.recipient_data.id_number' => 'nullable|string|max:255',
            'items.*.recipient_data.hospital_id' => 'nullable|exists:hospitals,id',
        ];
    }

    
public function withValidator($validator)
{
    $validator->after(function ($v) {
        $data = $v->getData();
        $items = $data['items'] ?? [];
        
        foreach ($items as $index => $item) {
            if ($item['is_general'] && !empty($item['blood_group_id'])) {
                $v->errors()->add("items.$index.blood_group_id", 'General request must not specify a blood group.');
            }

            if (!$item['is_general'] && empty($item['blood_group_id']) && !isset($item['add_new_recipient'])) {
                $v->errors()->add("items.$index.blood_group_id", 'Specific request must include a blood group.');
            }
            
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
            }
            
            if (!$item['is_general'] && empty($item['recipient_id']) && (!isset($item['add_new_recipient']) || $item['add_new_recipient'] !== true)) {
                $v->errors()->add("items.$index.recipient_id", 'Either select an existing recipient or add a new recipient.');
            }
        }
    });
}
}
