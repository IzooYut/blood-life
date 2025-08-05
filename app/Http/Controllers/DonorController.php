<?php

namespace App\Http\Controllers;

use App\Filters\DonorFilter;
use App\Http\Requests\StoreDonorRequest;
use App\Http\Requests\UserRequest;
use App\Models\Appointment;
use App\Models\BloodGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class DonorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, DonorFilter $filter)
    {
        //
        $donors = User::query()
            ->select([
                'users.id',
                'users.first_name',
                'users.last_name',
                'users.dob',
                'users.gender',
                'users.phone',
                'users.email',
                'users.blood_group_id',
            ])
            ->where('users.user_type', 'donor')
            ->with(['bloodGroup:id,name'])
            ->latest()
            ->paginate(15)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'dob' => $user->dob,
                    'gender' => $user->gender,
                    'phone' => $user->phone,
                    'email' => $user->email,
                    'blood_group_name' => optional($user->bloodGroup)->name,
                ];
            });


        return Inertia::render('Donors/Index', [
            'donors' => $donors,
            'filters' => $filter
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $blood_groups = BloodGroup::latest()->get(['name', 'id']);
        return Inertia::render('Donors/Create', [
            'bloodGroups' => $blood_groups
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDonorRequest $request)
    {

        $user = Auth::user();
        $user_type = $user?->user_type ?? null;
        $validated = $request->validated();
        $validated['user_type'] = 'donor';
        $validated['name'] = $validated['first_name'] . " " .  $validated['last_name'];
        $password = $validated['password'] ? $validated['password'] : $validated['phone'];
        $validated['password'] = Hash::make($password);
        User::create($validated);
        if ($user_type === 'donor') {
            return Redirect::route('requests-page')->with('Appointment Successfully Placed');
        }

        return Redirect::route('donors.index')->with('success', 'Donor Successfully Created');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
