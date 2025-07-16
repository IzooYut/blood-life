<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FcmToken extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'token', 'device_type', 'device_name', 'is_active'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
