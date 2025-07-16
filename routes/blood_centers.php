<?php

use App\Http\Controllers\BloodCenterController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth')->group(function(){
Route::resource('blood_centers',BloodCenterController::class);
});
