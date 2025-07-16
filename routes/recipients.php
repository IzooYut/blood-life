<?php

use App\Http\Controllers\RecipientController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
Route::resource('recipients',RecipientController::class);
});