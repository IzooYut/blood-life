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
}
