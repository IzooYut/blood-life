<?php

use App\Http\Controllers\AppointmentController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth')->group(function(){
Route::resource('appointments',AppointmentController::class);

});
