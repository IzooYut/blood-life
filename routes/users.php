<?php


use App\Http\Controllers\SystemUsersController;
use Illuminate\Support\Facades\Route;



Route::middleware(['auth'])->group(function(){
   
    Route::resource('system-users',SystemUsersController::class);
});