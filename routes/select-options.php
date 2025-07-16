<?php

use App\Http\Controllers\CustomerSelectController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
    Route::get('customers-select-options',CustomerSelectController::class);
});