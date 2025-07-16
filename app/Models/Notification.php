<?php

namespace App\Models;

use App\Traits\TracksAddedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory,TracksAddedBy;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'is_read',
        'added_by',
        'deleted_by'
    ];
}
