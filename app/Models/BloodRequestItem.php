<?php

namespace App\Models;

use App\Traits\TracksAddedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodRequestItem extends Model
{
    use HasFactory, TracksAddedBy;

    protected $fillable = [
        'blood_request_id',
        'blood_group_id',
        'recipient_id',
        'units_requested',
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
}
