<?php

namespace App\Models;

use App\Traits\TracksAddedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory, TracksAddedBy;

    protected $fillable = [
        'user_id',
        'blood_center_id',
        'blood_request_item_id',
        'appointment_date',
        'status',
        'notes',
        'added_by',
        'updated_by',
        'deleted_by'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function blood_group()
    {
        return $this->belongsTo(BloodGroup::class);
    }

    public function blood_center()
    {
        return $this->belongsTo(BloodCenter::class);
    }

    public function request()
    {
        return $this->belongsTo('blood_request_item_id');
    }
}
