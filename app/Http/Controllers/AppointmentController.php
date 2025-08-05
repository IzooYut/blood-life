<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Models\Appointment;
use App\Models\BloodCenter;
use App\Models\BloodGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Appointment::with(['user.bloodGroup', 'blood_center']);

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('blood_center_id')) {
            $query->where('blood_center_id', $request->integer('blood_center_id'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('appointment_date', [
                $request->date('date_from')->startOfDay(),
                $request->date('date_to')->endOfDay(),
            ]);
        }

        $appointments = $query->latest()->paginate(10)->withQueryString();


        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'filters' => $request->only('search', 'status', 'blood_center_id', 'user_id', 'date_from', 'date_to'),
            'bloodCenters' => BloodCenter::select('id', 'name')->get(),
            'bloodGroups' => BloodGroup::select('id', 'name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Appointments/Create', [
            'bloodGroups' => BloodGroup::select('id', 'name')->get(),
            'bloodCenters' => BloodCenter::select('id', 'name')->get(),
            'donors' => User::where('user_type', 'donor')->select('id', 'name')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAppointmentRequest $request)
    {
        $user = Auth::user();
        $user_type = $user->user_type;
        $validated = $request->validated();
        $user_id = isset($validated['user_id']) ? $validated['user_id'] : $user->id;
        $validated['user_id'] = $user_id;
        $appointment = Appointment::create($validated);

        if ($user_type === 'donor') {
            return Inertia::render('blood_requests/AppointmentThankyou', [
                'appointment' => $appointment->load(['blood_center']),
            ]);
        }
        return Redirect::route('appointments.index')->with('success', 'Appointment Successfully Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment)
    {
        return $appointment;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAppointmentRequest $request, Appointment $appointment)
    {
        $appointment->update($request->validated());
        return $appointment;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return response()->noContent();
    }
}
