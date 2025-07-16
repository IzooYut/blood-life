<?php

use App\Http\Controllers\BloodRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
Route::resource('blood-requests',BloodRequestController::class);
});