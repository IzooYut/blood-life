<?php

namespace App\Http\Controllers;

use App\Filters\DonorFilter;
use App\Http\Requests\StoreRecipientRequest;
use App\Models\BloodGroup;
use App\Models\Hospital;
use App\Models\Recipient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class RecipientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(DonorFilter $filter)
    {
        $recipients = Recipient::query()->select([
            'id',
            'name',
            'date_of_birth',
            'gender',
            'id_number',
            'blood_group_id',
            'hospital_id'
        ])->with(['bloodGroup:id,name', 'hospital:id,name'])
            ->paginate(15)
            ->through(function ($recipient) {
                return [
                    'id' => $recipient->id,
                    'name' => $recipient->name,
                    'id_number' => $recipient?->id_number ?? '-',
                    'dob' => $recipient?->date_of_birth ?? '-',
                    'gender' => $recipient?->gender ?? '-',
                    'medical_notes' => $recipient?->medical_notes ?? '-',
                    'blood_group_name' => optional($recipient->bloodGroup)->name,
                    'hospital_name' => optional($recipient->hospital)->name,
                ];
            });
            

        return Inertia::render('recipients/Index', [
            'recipients' => $recipients,
            'filters' => $filter

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $hospitals = Hospital::select('id', 'name')->get();
        $blood_groups = BloodGroup::select('id', 'name')->get();
        return Inertia::render('recipients/Create', [
            'blood_groups' => $blood_groups,
            'hospitals' => $hospitals
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecipientRequest $request)
    {
        $validated = $request->validated();
        Recipient::create($validated);
        return Redirect::route('recipients.index')->with('success', 'Recipient Successfully Registered');
    }

    /**
     * Display the specified resource.
     */
    public function show(Recipient $recipient)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recipient $recipient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recipient $recipient)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipient $recipient)
    {
        //
    }
}
