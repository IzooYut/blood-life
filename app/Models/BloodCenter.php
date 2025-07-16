<?php

namespace App\Models;

use App\Traits\TracksAddedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodCenter extends Model
{
    use HasFactory,TracksAddedBy;
    
    protected $fillable = [
        'name',
        'location',
        'address',
        'longitude',
        'latitude',
        'added_by',
        'updated_by',
        'deleted_by'
    ];

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
