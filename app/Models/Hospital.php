<?php

namespace App\Models;

use App\Traits\TracksAddedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Hospital extends Model
{
    use HasFactory,Notifiable,TracksAddedBy;

    protected $fillable = [
        'name',
        'logo',
        'address',
        'contact_person',
        'phone',
        'email',
        'user_id',
        'added_by',
        'updated_by',
        'deleted_by'
    ];

    public function bloodRequests()
    {
        return $this->hasMany(BloodRequest::class);
    }
}
