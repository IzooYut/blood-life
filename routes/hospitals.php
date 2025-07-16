<?php

use App\Http\Controllers\HospitalController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth')->group(function(){
Route::resource('hospitals',HospitalController::class);

});
