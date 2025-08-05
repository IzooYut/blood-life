<?php

namespace App\Http\Controllers;

use App\Models\BloodCenter;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBloodCenterRequest;
use App\Http\Requests\UpdateBloodCenterRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BloodCenterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = BloodCenter::query()
            ->select(['id', 'name','contact_person','email','phone', 'location', 'address', 'created_at'])
            ->withCount(['donations', 'appointments']);
        if ($search = $request->input('search')) {
            $query->where('name', 'like', '%' . $search . '%');
        }
        $blood_centers = $query
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();
        return Inertia::render('BloodCenters/Index', [
            'blood_centers' => $blood_centers,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('BloodCenters/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBloodCenterRequest $request)
    {
        $validated = $request->validated();
        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'user_type' => 'center_staff',
                'password' => Hash::make('password')
            ]);
            $validated['user_id'] = $user->id;
            BloodCenter::create($validated);
        });
        return Redirect::route('blood_centers.index')->with('success', 'Blood Center Created Successfully');
        // return response()->json($center, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(BloodCenter $bloodCenter)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BloodCenter $bloodCenter)
    {
        return $bloodCenter;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBloodCenterRequest $request, BloodCenter $bloodCenter)
    {
        $bloodCenter->update($request->validated());
        return response()->json($bloodCenter);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BloodCenter $bloodCenter)
    {
        $bloodCenter->delete();
        return response()->noContent();
    }
}
