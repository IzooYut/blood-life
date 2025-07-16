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
        'volume_ml',
        'donation_date',
        'screening_status',
        'notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bloodGroup()
    {
        return $this->belongsTo(BloodGroup::class);
    }

    public function bloodCenter()
    {
        return $this->belongsTo(BloodCenter::class);
    }
}
