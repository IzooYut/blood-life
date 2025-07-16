<?php

namespace App\Http\Controllers;

use App\Http\Requests\BloodGroupRequest;
use App\Http\Requests\BloodRequest;
use App\Http\Requests\StoreBloodRequest;
use App\Http\Requests\UpdateBloodRequest;
use App\Models\BloodGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BloodGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $blood_groups=BloodGroup::latest()->paginate(15);

        return Inertia::render('blood_groups/Index',[
            'blood_groups'=> $blood_groups
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BloodGroupRequest $request)
    {
        $validated = $request->validated();
         BloodGroup::updateOrCreate(
            ['id'=>$validated['id']],
            ['name'=>$validated['name']]
        );
        return Redirect::route('blood-groups.index')->with('success','Blood Group Created Successfully');
        
    }

    /**
     * Display the specified resource.
     */
    public function show(BloodGroup $bloodGroup)
    {
        return $bloodGroup;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BloodGroup $bloodGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBloodRequest $request, BloodGroup $bloodGroup)
    {
        $bloodGroup->update($request->validated());
        return $bloodGroup;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BloodGroup $bloodGroup)
    {
        $bloodGroup->delete();
        return back();
    }
}
