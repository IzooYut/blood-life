<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BloodCenterDashboardController;
use App\Http\Controllers\BloodRequestItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HospitalDashboardController;
use App\Http\Middleware\EnsurePasswordUpdated;
use App\Models\BloodCenter;
use App\Models\BloodGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    // return Inertia::render('auth/login', [
    //     'canResetPassword' => Route::has('password.request'),
    //     'status' => $request->session()->get('status'),
    // ]);
     $bloodCenters = BloodCenter::paginate(9);
    return Inertia::render('Home',[
        'blood_centers'=>$bloodCenters
    ]);
})->name('home');

// Route::get('/', [AuthenticatedSessionController::class, 'create']);

Route::middleware(['auth', 'verified',EnsurePasswordUpdated::class])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('h-dashboard', HospitalDashboardController::class)->name('h-dashboard');
    Route::get('bc-dashboard',BloodCenterDashboardController::class)->name('bc-dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/users.php';
require __DIR__.'/auth.php';
require __DIR__.'/donors.php';
require __DIR__.'/hospitals.php';
require __DIR__.'/blood_centers.php';
require __DIR__.'/appointments.php';
require __DIR__.'/blood_requests.php';
require __DIR__.'/recipients.php';
require __DIR__.'/blood_groups.php';
require __DIR__.'/donations.php';
require __DIR__.'/reports.php';

