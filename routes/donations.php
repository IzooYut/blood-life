<?php

use App\Http\Controllers\DonationController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth')->group(function(){
Route::resource('donations',DonationController::class);
});
