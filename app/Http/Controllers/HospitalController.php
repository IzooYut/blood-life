<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHospitalRequest;
use App\Http\Requests\UpdateHospitalRequest;
use App\Models\Hospital;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class HospitalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hospitals = Hospital::latest()->paginate(15);
        return Inertia::render('Hospitals/Index', [
            'hospitals' => $hospitals
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Hospitals/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHospitalRequest $request)
    {
        $validated = $request->validated();
        //dd($validated);
        DB::transaction(function () use ($validated) {
             $user=User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'user_type' => 'hospital_staff',
                'password'=>Hash::make('password')
            ]);
            $validated['user_id'] = $user->id;
            Hospital::create($validated);
           
        });
        return Redirect::route('hospitals.index')->with('success', 'Hospital Registered Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Hospital $hospital)
    {
        return $hospital;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hospital $hospital)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHospitalRequest $request, Hospital $hospital)
    {
        $hospital->update($request->validated());
        return $hospital;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hospital $hospital)
    {
        $hospital->delete();
        return response()->noContent();
    }
}
