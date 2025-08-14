<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDonationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => [
                'nullable',
                'integer',
                'exists:users,id'
            ],
            'blood_center_id' => [
                'required',
                'integer',
                'exists:blood_centers,id'
            ],
            'blood_request_item_id' => [
                'nullable',
                'integer',
                'exists:blood_request_items,id' // Adjust table name as needed
            ],
            'appointment_id' => [
                'nullable',
                'integer',
                'exists:appointments,id'
            ],
            'volume_ml' => [
                'required',
                'integer',
                'min:100',
                'max:1000' // Typical blood donation range
            ],
            'weight' => [
                'nullable',
                'numeric',
                'min:50',
                'max:300' // Reasonable weight range in kg
            ],
            'donation_date_time' => [
                'required',
                'date',
                'before_or_equal:now'
            ],
            'screening_status' => [
                'required',
                'string',
                Rule::in(['not_screened', 'passed', 'failed'])
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000'
            ]
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'user_id.exists' => 'The selected donor does not exist.',
            'blood_center_id.required' => 'Please select a blood center.',
            'blood_center_id.exists' => 'The selected blood center does not exist.',
            'blood_request_item_id.exists' => 'The selected blood request item does not exist.',
            'appointment_id.exists' => 'The selected appointment does not exist.',
            'volume_ml.required' => 'Please specify the volume of blood donated.',
            'volume_ml.min' => 'Volume must be at least 100ml.',
            'volume_ml.max' => 'Volume cannot exceed 1000ml.',
            'weight.min' => 'Weight must be at least 50kg.',
            'weight.max' => 'Weight cannot exceed 300kg.',
            'donation_date_time.required' => 'Please specify the donation date and time.',
            'donation_date_time.before_or_equal' => 'Donation date and time cannot be in the future.',
            'screening_status.required' => 'Please select a screening status.',
            'screening_status.in' => 'Invalid screening status selected.',
            'notes.max' => 'Notes cannot exceed 1000 characters.'
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'user_id' => 'donor',
            'blood_center_id' => 'blood center',
            'blood_request_item_id' => 'blood request item',
            'appointment_id' => 'appointment',
            'volume_ml' => 'volume (ml)',
            'donation_date_time' => 'donation date and time',
            'screening_status' => 'screening status',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert empty strings to null for nullable fields
        $this->merge([
            'user_id' => $this->user_id ?: null,
            'blood_request_item_id' => $this->blood_request_item_id ?: null,
            'appointment_id' => $this->appointment_id ?: null,
            'weight' => $this->weight ?: null,
            'notes' => $this->notes ?: null,
        ]);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Custom validation: Check if user has donated recently (optional business rule)
            // if ($this->user_id) {
            //     $recentDonation = \App\Models\Donation::where('user_id', $this->user_id)
            //         ->where('donation_date_time', '>=', now()->subDays(56)) // 8 weeks minimum gap
            //         ->first();

            //     if ($recentDonation) {
            //         // Ensure we have a Carbon instance
            //         $donationDate = $recentDonation->donation_date_time instanceof \Carbon\Carbon 
            //             ? $recentDonation->donation_date_time 
            //             : \Carbon\Carbon::parse($recentDonation->donation_date_time);
                    
            //         $nextAllowedDate = $donationDate->addDays(56);
                    
            //         $validator->errors()->add(
            //             'user_id', 
            //             'This donor has donated within the last 8 weeks. Next donation allowed after ' . 
            //             $nextAllowedDate->format('M d, Y')
            //         );
            //     }
            // }

            // Custom validation: Check if appointment is already used for another donation
            if ($this->appointment_id) {
                $existingDonation = \App\Models\Donation::where('appointment_id', $this->appointment_id)
                    ->first();

                if ($existingDonation) {
                    $validator->errors()->add(
                        'appointment_id',
                        'This appointment already has a donation record.'
                    );
                }
            }

            // Custom validation: Ensure weight is provided for successful donations
            if ($this->screening_status === 'passed' && !$this->weight) {
                $validator->errors()->add(
                    'weight',
                    'Weight is required for donations that passed screening.'
                );
            }

            // Custom validation: Volume should be standard amounts
            $standardVolumes = [250, 350, 450, 500];
            if ($this->volume_ml && !in_array($this->volume_ml, $standardVolumes)) {
                $validator->errors()->add(
                    'volume_ml',
                    'Volume should be one of the standard amounts: ' . implode(', ', $standardVolumes) . 'ml.'
                );
            }
        });
    }
}