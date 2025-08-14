<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
Route::get('/reports/{type}/{format}', [ReportController::class, 'export'])->name('reports.export');
});