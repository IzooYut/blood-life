<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait TracksAddedBy
{
    /**
     * Boot the trait and listen to the model creating event
     */

     protected static function booted():void
     {
        //When creating set added_by
        static::creating(function (Model $model)
        {
            if(Auth::check() && empty($model->added_by))
            $model->added_by = Auth::id();
        });

        //When updating set updated_by
        static::updating(function(Model $model){
            if(Auth::check())
            {
                $model->updated_by = Auth::id();
            }
        });

        //when soft deleting set deleted_by
        static::deleting(function(Model $model){
            if(Auth::check() && method_exists($model,'setDeletedBy'))
            {
                $model->setDeletedBy(Auth::id());
                $model->save();
            }
        });

     }

     /**
     * Relationship to user who added this model.
     */
    public function addedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'added_by');
    }

    /**
     * Relationship to user who last updated this model.
     */
    public function updatedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'updated_by');
    }

    /**
     * Relationship to user who soft-deleted this model.
     */
    public function deletedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'deleted_by');
    }

    /**
     * Set the deleted_by manually from inside the deleting event.
     */
    public function setDeletedBy(int $userId): void
    {
        $this->deleted_by = $userId;
    }

}
