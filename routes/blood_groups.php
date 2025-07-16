<?php
use App\Http\Controllers\BloodGroupController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
Route::resource('blood-groups',BloodGroupController::class);
});