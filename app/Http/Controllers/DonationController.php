<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDonationRequest;
use App\Http\Requests\UpdateDonationRequest;
use App\Models\Appointment;
use App\Models\BloodCenter;
use App\Models\Donation;
use App\Models\Recipient;
use App\Models\User;
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
                'donor:id,name,email', // Only load needed fields
                'bloodCenter:id,name,location',
                'blood_request_item:id,unique_code,recipient_id',
                'blood_request_item.recipient:id,name,phone_no' // Nested eager loading
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

        // Add index for common queries if not exists
        // You should run this migration: 
        // Schema::table('donations', function (Blueprint $table) {
        //     $table->index(['donation_date_time', 'screening_status']);
        //     $table->index(['user_id', 'donation_date_time']);
        //     $table->index(['blood_center_id', 'donation_date_time']);
        // });

        // Execute paginated query
        $donations = $query->paginate($perPage)->withQueryString();

        // Get filter options for dropdowns (cached for performance)
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDonationRequest $request)
    {


        try {
            Donation::create($request->validated());

            if ($request->appointment_id) {
                $appointment = Appointment::find($request->appointment_id);
                if ($appointment) {
                    $appointment->update(['status' => 'accepted']);
                }
            }

            return back()->with('success', 'Donation recorded successfully!');
        } catch (\Exception $e) {
            // dd($e->getMessage());
            \Log::error('Error creating donation: ' . $e->getMessage());
            return back()->withErrors(['general' => 'An error occurred while recording the donation.']);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Donation $donation)
    {
        //
        return $donation;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Donation $donation)
    {
        return $donation;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDonationRequest $request, Donation $donation)
    {
        $donation->update($request->validated());
        return $donation;
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
