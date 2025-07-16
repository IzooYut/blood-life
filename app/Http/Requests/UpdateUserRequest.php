<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'phone' => 'required|string|max:255',
            'email' => 'required|email',
            'referred_by_code' => 'nullable|string|exists:users,referral_code',
            'country'=>'required|string',
            'region'=>'required|string',
            'company_name'=>'nullable|string',
            'commission'=>'nullable',
            'comment'=>'nullable',
            'website_url'=>'nullable|string',
            'channel'=>'nullable|string'
        ];
    }
}
