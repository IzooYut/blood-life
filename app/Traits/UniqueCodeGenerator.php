<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Carbon\Carbon;

trait UniqueCodeGenerator
{
    /**
     * Boot the trait and register the creating event listener
     */
    protected static function bootUniqueCodeGenerator(): void
    {
        static::creating(function ($model) {
            if (empty($model->unique_code)) {
                $model->unique_code = $model->generateUniqueCode();
            }
        });
    }

    /**
     * Generate a unique code in format: ABC-123456-DDMMYY
     * Where:
     * - ABC: First 3 letters of hospital name
     * - 123456: 6-digit random number
     * - DDMMYY: Day, month, year (2 digits each)
     */
    protected function generateUniqueCode(): string
    {
        $hospitalCode = $this->getHospitalCode();
        $dateCode = $this->getDateCode();
        
        do {
            $randomCode = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
            $uniqueCode = "{$hospitalCode}-{$randomCode}-{$dateCode}";
        } while ($this->codeExists($uniqueCode));

        return $uniqueCode;
    }

    /**
     * Get the hospital code from the recipient's hospital
     */
    protected function getHospitalCode(): string
    {
        // Assuming recipient belongs to a hospital
        $hospitalName = $this->recipient->hospital->name ?? 'GENERAL';
        
        // Extract first 3 letters, remove spaces and convert to uppercase
        $code = strtoupper(preg_replace('/[^A-Z]/', '', $hospitalName));
        
        // Take first 3 characters, pad with 'X' if needed
        return str_pad(substr($code, 0, 3), 3, 'X', STR_PAD_RIGHT);
    }

    /**
     * Get the date code in DDMMYY format
     */
    protected function getDateCode(): string
    {
        return Carbon::now()->format('dmy');
    }

    /**
     * Check if the code already exists
     */
    protected function codeExists(string $code): bool
    {
        return static::where('unique_code', $code)->exists();
    }

    /**
     * Generate a new unique code manually (if needed)
     */
    public function regenerateUniqueCode(): string
    {
        $this->unique_code = $this->generateUniqueCode();
        $this->save();
        
        return $this->unique_code;
    }

    /**
     * Get the unique code with formatted display
     */
    public function getFormattedUniqueCodeAttribute(): string
    {
        return $this->unique_code;
    }

    /**
     * Scope to find by unique code
     */
    public function scopeByUniqueCode($query, string $code)
    {
        return $query->where('unique_code', $code);
    }
}