<?php

namespace App\Models;

use App\Traits\TracksAddedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Recipient extends Model
{

    use HasFactory,Notifiable,TracksAddedBy;

    protected $fillable = [
        'name',
        'blood_group_id',
        'hospital_id',
        'id_number',
        'date_of_birth',
        'gender',
        'medical_notes'
    ];

     public function bloodGroup()
    {
        return $this->belongsTo(BloodGroup::class);
    }

     public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

    /**
     * Get all blood request items for this recipient
     * One recipient can have many blood request items
     */
    public function blood_request_items()
    {
        return $this->hasMany(BloodRequestItem::class, 'recipient_id');
    }
}
