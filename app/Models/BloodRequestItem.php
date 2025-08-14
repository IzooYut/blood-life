<?php

namespace App\Models;

use App\Traits\TracksAddedBy;
use App\Traits\UniqueCodeGenerator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BloodRequestItem extends Model
{
    use HasFactory, TracksAddedBy,SoftDeletes,UniqueCodeGenerator;

    protected $fillable = [
        'blood_request_id',
        'blood_group_id',
        'unique_code',
        'recipient_id',
        'units_requested',
        'units_fulfilled',
        'is_general',
        'urgency',
        'status',
        'added_by',
        'updated_by',
        'deleted_by'
    ];

    public function request()
    {
        return $this->belongsTo(BloodRequest::class, 'blood_request_id');
    }

    public function bloodGroup()
    {
        return $this->belongsTo(BloodGroup::class);
    }

    public function recipient()
    {
        return $this->belongsTo(Recipient::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'blood_request_item_id');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'blood_request_item_id');
    }
}
