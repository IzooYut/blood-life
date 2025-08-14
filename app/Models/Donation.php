<?php

namespace App\Models;

use App\Traits\TracksAddedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory,TracksAddedBy;

    protected $fillable = [
        'user_id',
        'blood_center_id',
        'blood_group_id',
        'appointment_id',
        'blood_request_item_id',
        'volume_ml',
        'weight',
        'donation_date_time',
        'screening_status',
        'notes'
    ];

     /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'donation_date_time' => 'datetime',
        'weight' => 'decimal:2',
        'volume_ml' => 'integer',
    ];


    public function donor()
    {
       return $this->belongsTo(User::class, 'user_id');
    }

    public function bloodGroup()
    {
        return $this->belongsTo(BloodGroup::class);
    }

    public function bloodCenter()
    {
        return $this->belongsTo(BloodCenter::class);
    }

    public function blood_request_item()
    {
        return $this->belongsTo(BloodRequestItem::class);
    }

    public function appointments()
    {
        return $this->belongsTo(Appointment::class);
    }

    
}
