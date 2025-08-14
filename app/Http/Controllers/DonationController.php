<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDonationRequest;
use App\Http\Requests\UpdateDonationRequest;
use App\Models\Appointment;
use App\Models\BloodCenter;
use App\Models\BloodGroup;
use App\Models\BloodRequestItem;
use App\Models\Donation;
use App\Models\Recipient;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DonationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Validate and set defaults for filters
        $filters = $request->validate([
            'search' => 'nullable|string|max:255',
            'screening_status' => 'nullable|in:not_screened,passed,failed',
            'donor_id' => 'nullable|integer|exists:users,id',
            'recipient_id' => 'nullable|integer|exists:recipients,id',
            'blood_center_id' => 'nullable|integer|exists:blood_centers,id',
            'per_page' => 'nullable|integer|min:10|max:100',
            'sort_by' => 'nullable|in:donation_date_time,donor_name,blood_center_name,screening_status,volume_ml',
            'sort_direction' => 'nullable|in:asc,desc',
        ]);

        // Set defaults
        $perPage = $filters['per_page'] ?? 15;
        $sortBy = $filters['sort_by'] ?? 'donation_date_time';
        $sortDirection = $filters['sort_direction'] ?? 'desc';

        // Build the optimized query with eager loading to prevent N+1 queries
        $query = Donation::query()
            ->with([
                'donor:id,name,email',
                'bloodCenter:id,name,location',
                'blood_request_item:id,unique_code,recipient_id',
                'blood_request_item.recipient:id,name,phone_no'
            ])
            ->select([
                'id',
                'user_id',
                'blood_center_id',
                'blood_request_item_id',
                'appointment_id',
                'volume_ml',
                'donation_date_time',
                'screening_status',
                'notes'
            ]);
        $user = Auth::user();


        if ($user->user_type === "center_staff") {
            $blood_center =  BloodCenter::where('user_id', $user->id)->first();
            $query->where('blood_center_id', $blood_center->id);
        }

        // Apply search filter
        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('donor', function ($donorQuery) use ($searchTerm) {
                    $donorQuery->where('name', 'like', $searchTerm)
                        ->orWhere('email', 'like', $searchTerm);
                })
                    ->orWhereHas('bloodCenter', function ($centerQuery) use ($searchTerm) {
                        $centerQuery->where('name', 'like', $searchTerm);
                    })
                    ->orWhereHas('blood_request_item.recipient', function ($recipientQuery) use ($searchTerm) {
                        $recipientQuery->where('name', 'like', $searchTerm);
                    })
                    ->orWhere('notes', 'like', $searchTerm);
            });
        }

        // Apply specific filters
        if (!empty($filters['screening_status'])) {
            $query->where('screening_status', $filters['screening_status']);
        }

        if (!empty($filters['donor_id'])) {
            $query->where('user_id', $filters['donor_id']);
        }

        if (!empty($filters['recipient_id'])) {
            $query->whereHas('blood_request_item', function ($q) use ($filters) {
                $q->where('recipient_id', $filters['recipient_id']);
            });
        }

        if (!empty($filters['blood_center_id'])) {
            $query->where('blood_center_id', $filters['blood_center_id']);
        }

        // Apply sorting with optimized joins for related fields
        switch ($sortBy) {
            case 'donor_name':
                $query->join('users', 'donations.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sortDirection);
                break;
            case 'blood_center_name':
                $query->join('blood_centers', 'donations.blood_center_id', '=', 'blood_centers.id')
                    ->orderBy('blood_centers.name', $sortDirection);
                break;
            default:
                $query->orderBy($sortBy, $sortDirection);
                break;
        }


        $donations = $query->paginate($perPage)->withQueryString();

        $filterOptions = [
            'bloodCenters' => Cache::remember('blood_centers_options', 3600, function () {
                return BloodCenter::select('id', 'name')
                    ->orderBy('name')
                    ->get()
                    ->map(fn($center) => ['id' => $center->id, 'name' => $center->name]);
            }),
            'donors' => Cache::remember('donors_options', 3600, function () {
                return User::select('id', 'name')
                    ->whereHas('donations') // Only users who have made donations
                    ->orderBy('name')
                    ->get()
                    ->map(fn($donor) => ['id' => $donor->id, 'name' => $donor->name]);
            }),
            'recipients' => Cache::remember('recipients_options', 3600, function () {
                return Recipient::select('id', 'name')
                    ->whereHas('blood_request_items.donations') // Only recipients with donations
                    ->orderBy('name')
                    ->get()
                    ->map(fn($recipient) => ['id' => $recipient->id, 'name' => $recipient->name]);
            }),
            'screeningStatuses' => [
                ['value' => 'not_screened', 'label' => 'Not Screened'],
                ['value' => 'passed', 'label' => 'Passed'],
                ['value' => 'failed', 'label' => 'Failed'],
            ]
        ];


        return Inertia::render('Donations/Index', [
            'donations' => $donations,
            'filters' => $filters,
            'filterOptions' => $filterOptions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all registered donors with their blood groups
        $donors = User::with('bloodGroup')
            ->where('user_type', 'donor') // Assuming you have a role field
            ->whereNotNull('first_name')
            ->whereNotNull('last_name')
            ->whereHas('bloodGroup') // Only include users with blood groups
            ->orderBy('first_name')
            ->get()
            ->map(function ($user) {
                // Additional null checks within the mapping
                if (!$user->bloodGroup) {
                    return null;
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name ?? ($user->first_name . ' ' . $user->last_name),
                    'first_name' => $user->first_name ?? '',
                    'last_name' => $user->last_name ?? '',
                    'blood_group' => [
                        'id' => $user->bloodGroup->id,
                        'name' => $user->bloodGroup->name ?? 'Unknown',
                    ]
                ];
            })
            ->filter() // Remove null values from the collection
            ->values(); // Re-index the array

        // Get all blood centers
        $bloodCenters = BloodCenter::select('id', 'name')
            ->whereNotNull('name')
            ->orderBy('name')
            ->get()
            ->map(function ($center) {
                return [
                    'id' => $center->id,
                    'name' => $center->name ?? 'Unnamed Center'
                ];
            });

        // Get all blood groups
        $bloodGroups = BloodGroup::select('id', 'name')
            ->whereNotNull('name')
            ->orderBy('name')
            ->get()
            ->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name ?? 'Unknown Type'
                ];
            });

        // Get recent appointments (optional, for linking)
        // $appointments = Appointment::with(['user', 'blood_center'])
        //     ->where('appointment_date', '>=', now()->subDays(30))
        //     ->where('status', 'accepted')
        //     ->whereHas('user') // Only include appointments with valid users
        //     ->whereHas('blood_center') // Only include appointments with valid blood centers
        //     ->orderBy('appointment_date', 'desc')
        //     ->get()
        //     ->map(function ($appointment) {
        //         // Null checks for related models
        //         if (!$appointment->user || !$appointment->blood_center) {
        //             return null;
        //         }

        //         return [
        //             'id' => $appointment->id,
        //             'user' => [
        //                 'first_name' => $appointment->user->first_name ?? '',
        //                 'last_name' => $appointment->user->last_name ?? '',
        //             ],
        //             'blood_center' => [
        //                 'name' => $appointment->blood_center->name ?? 'Unknown Center',
        //             ],
        //             'appointment_date' => $appointment->appointment_date
        //                 ? Carbon::parse($appointment->appointment_date)->toISOString()
        //                 : now()->toISOString(),
        //             'status' => $appointment->status ?? 'unknown',
        //         ];
        //     })
        //     ->filter() // Remove null values
        //     ->values(); // Re-index

        // Get active blood requests (optional, for linking)
        $bloodRequests = BloodRequestItem::with(['bloodGroup', 'recipient.bloodGroup'])
            // ->whereHas('bloodGroup', function ($query) {
            //     $query->whereNotNull('name');
            // })
            ->where('status', 'pending')
            ->whereNotNull('units_requested')
            ->latest()
            ->get()
            ->map(function ($item) {
                // Comprehensive null checks
                if (!$item->recipient || !$item->bloodGroup) {
                    return null;
                }

                $title = $item?->unique_code . ' ' . $item?->recipient?->name ?? 'Untitled Request';
                $bloodGroupName = $item?->recipient?->bloodGroup->name ?? 'Unknown Type';
                $quantity = $item->units_requested ?? 0;

                return [
                    'id' => $item->id,
                    'label' => "{$title} - {$bloodGroupName} ({$quantity} units)",
                ];
            })
            ->filter() // Remove null values
            ->values(); // Re-index

        return Inertia::render('Donations/Create', [
            'donors' => $donors,
            'bloodCenters' => $bloodCenters,
            'bloodGroups' => $bloodGroups,
            'bloodRequests' => $bloodRequests,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDonationRequest $request)
    {

        $validated = $request->validated();

        try {
            Donation::create($validated);

            if ($validated['appointment_id']) {
                $appointment = Appointment::find($$validated['appointment_id']);
                if ($appointment) {
                    $appointment->update(['status' => 'accepted']);
                }
            }
            // Update blood request item if linked and screening passed
            if ($validated['blood_request_item_id'] && $validated['screening_status'] === 'passed') {
                $bloodRequestItem = BloodRequestItem::find($validated['blood_request_item_id']);
                if ($bloodRequestItem) {
                    // Add the donated volume to the fulfilled quantity
                    $volumeInUnits = $validated['volume_ml'];
                    $bloodRequestItem->increment('units_fulfilled', $volumeInUnits);


                    // Check if request is fully fulfilled
                    if ($bloodRequestItem->units_requested >= $bloodRequestItem->units_fulfilled) {
                        $bloodRequestItem->update(['status' => 'fulfilled']);
                    }
                }
            }

            return back()->with('success', 'Donation recorded successfully!');
        } catch (\Exception $e) {
            \Log::error('Error creating donation: ' . $e->getMessage());
            return back()->withErrors(['general' => 'An error occurred while recording the donation.']);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Donation $donation)
    {
         return Inertia::render('Donations/Show', [
        'donation' => $donation->load([
            'donor.bloodGroup',
            'bloodCenter',
            'bloodGroup',
            'appointments',
            'blood_request_item.bloodGroup',
            'blood_request_item.recipient.bloodGroup',
            'blood_request_item.recipient.hospital',
            'blood_request_item.request'
        ]),
        'canEdit' => auth()->user()->can('update', $donation),
        'canDelete' => auth()->user()->can('delete', $donation),
    ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Donation $donation)
    {
        return Inertia::render('Donations/Edit', [
            'donation' => $donation->load(['donor.bloodGroup', 'bloodCenter', 'bloodGroup', 'appointments', 'blood_request_item']),
            'donors' => User::with('bloodGroup')->get(),
            'bloodCenters' => BloodCenter::all(),
            'bloodGroups' => BloodGroup::all(),
            'appointments' => Appointment::with(['user', 'blood_center'])->get(),
            'bloodRequests' => BloodRequestItem::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDonationRequest $request, Donation $donation)
    {
        $validated = $request->validated();
    
    try {
        $donation->update($validated);
        
        // Handle appointment status updates if changed
        if ($validated['appointment_id'] && $validated['appointment_id'] != $donation->appointment_id) {
            $appointment = Appointment::find($validated['appointment_id']);
            if ($appointment) {
                $appointment->update(['status' => 'accepted']);
            }
        }
        
        // Handle blood request updates if screening status changed
        if ($validated['blood_request_item_id'] && $validated['screening_status'] === 'passed') {
             // Update blood request item if linked and screening passed
            if ($validated['blood_request_item_id'] && $validated['screening_status'] === 'passed') {
                $bloodRequestItem = BloodRequestItem::find($validated['blood_request_item_id']);
                if ($bloodRequestItem) {
                    $volumeInUnits = $validated['volume_ml'];
                    $bloodRequestItem->increment('units_fulfilled', $volumeInUnits);


                    if ($bloodRequestItem->units_requested >= $bloodRequestItem->units_fulfilled) {
                        $bloodRequestItem->update(['status' => 'fulfilled']);
                    }
                }
            }
        }
        
        return back()->with('success', 'Donation updated successfully!');
    } catch (\Exception $e) {
        \Log::error('Error updating donation: ' . $e->getMessage());
        return back()->withErrors(['general' => 'An error occurred while updating the donation.']);
    }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Donation $donation)
    {
        $donation->delete();
        return response()->noContent();
    }
}
