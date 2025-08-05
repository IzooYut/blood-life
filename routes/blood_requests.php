<?php

use App\Http\Controllers\BloodRequestController;
use App\Http\Controllers\BloodRequestItemController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
Route::resource('blood-requests',BloodRequestController::class);
Route::get('requests-page',BloodRequestItemController::class)->name('requests-page');
});