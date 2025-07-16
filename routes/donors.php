<?php

use App\Http\Controllers\DonorController;

use Illuminate\Support\Facades\Route;


Route::middleware('auth')->group(function(){
Route::resource('donors',DonorController::class);

});
