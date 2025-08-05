<?php

namespace App\Models;

use App\Traits\HasHospitalBloodRequests;
use App\Traits\TracksAddedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodRequest extends Model
{
    use HasFactory, TracksAddedBy;

    protected $fillable = [
        'hospital_id',
        'request_date',
        'notes',
        'status',
        'added_by',
        'updated_by',
        'deleted_by'
    ];

    public function items()
    {
        return $this->hasMany(BloodRequestItem::class);
    }

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }
}
