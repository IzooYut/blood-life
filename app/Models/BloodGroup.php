<?php

namespace App\Models;

use App\Traits\TracksAddedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodGroup extends Model
{
    use HasFactory,TracksAddedBy;

    protected $fillable = ['name','added_by','updated_by','deleted_by'];

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
    
}
