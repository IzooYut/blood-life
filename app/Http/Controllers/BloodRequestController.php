<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBloodRequest;
use App\Http\Requests\UpdateBloodRequest;
use App\Models\BloodGroup;
use App\Models\BloodRequest;
use App\Models\Hospital;
use App\Models\Recipient;
use App\Services\BloodRequestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BloodRequestController extends Controller
{

    protected $bloodRequestService;

    public function __construct(BloodRequestService $bloodRequestService)
    {
        $this->bloodRequestService = $bloodRequestService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        // Validate and sanitize request parameters
        $user = Auth::user();
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:pending,approved,fulfilled,cancelled,partial',
            'hospital_id' => 'nullable|exists:hospitals,id',
            'urgency' => 'nullable|string|in:urgent,normal,low',
            'per_page' => 'nullable|integer|min:10|max:100',
            'sort_by' => 'nullable|string|in:request_date,created_at,hospital_name,status',
            'sort_direction' => 'nullable|string|in:asc,desc'
        ]);

        $perPage = $validated['per_page'] ?? 15;
        $sortBy = $validated['sort_by'] ?? 'request_date';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        $query = BloodRequest::query()
            ->with([
                'hospital:id,name,address,contact_person,phone,email',
                'items' => function ($query) {
                    $query->select('id', 'blood_request_id', 'blood_group_id', 'units_requested', 'urgency', 'status')
                        ->with('bloodGroup:id,name');
                }
            ])
            ->select('id', 'hospital_id', 'request_date', 'status', 'created_at', 'updated_at')
            ->latest();

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->whereHas('hospital', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($user->user_type === "hospital_staff") {
            $hospital =  Hospital::where('user_id', $user->id)->first();
            $query->where('hospital_id', $hospital->id);
        }

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (!empty($validated['hospital_id'])) {
            $query->where('hospital_id', $validated['hospital_id']);
        }

        if (!empty($validated['urgency'])) {
            $query->whereHas('items', function ($q) use ($validated) {
                $q->where('urgency', $validated['urgency']);
            });
        }

        switch ($sortBy) {
            case 'hospital_name':
                $query->join('hospitals', 'blood_requests.hospital_id', '=', 'hospitals.id')
                    ->orderBy('hospitals.name', $sortDirection)
                    ->select('blood_requests.*');
                break;
            case 'request_date':
                $query->orderBy('request_date', $sortDirection);
                break;
            case 'request_date':
                $query->orderBy('request_date', $sortDirection);
                break;
            case 'status':
                $query->orderBy('status', $sortDirection);
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $bloodRequests = $query->paginate($perPage)
            ->withQueryString()
            ->through(function ($request) {
                return [
                    'id' => $request->id,
                    'hospital' => [
                        'id' => $request->hospital->id,
                        'name' => $request->hospital->name,
                        'address' => $request->hospital->address,
                        'contact_person' => $request->hospital->contact_person,
                        'phone' => $request->hospital->phone,
                        'email' => $request->hospital->email,
                    ],
                    'request_date' => $request->request_date,
                    'status' => $request->status,
                    'items' => $request->items->map(function ($item) {
                        return [
                            'id' => $item?->id ?? null,
                            'blood_group' => [
                                'id' => $item?->bloodGroup?->id ?? '-',
                                'name' => $item?->bloodGroup?->name ?? '-',
                            ],
                            'units_requested' => $item->units_requested,
                            'urgency' => $item->urgency,
                            'status' => $item->status,
                        ];
                    }),
                    'created_at' => $request->created_at,
                    'updated_at' => $request->updated_at,
                ];
            });

        $filterOptions = $this->getFilterOptions();

        return Inertia::render('blood_requests/Index', [
            'bloodRequests' => $bloodRequests,
            'filters' => $validated,
            'filterOptions' => $filterOptions,
        ]);
    }


    /**
     * Get filter options for dropdowns
     */
    private function getFilterOptions(): array
    {
        return [
            'hospitals' => \App\Models\Hospital::select('id', 'name')
                ->orderBy('name')
                ->get()
                ->toArray(),
            'statuses' => [
                ['value' => 'pending', 'label' => 'Pending'],
                ['value' => 'approved', 'label' => 'Approved'],
                ['value' => 'fulfilled', 'label' => 'Fulfilled'],
                ['value' => 'cancelled', 'label' => 'Cancelled'],
                ['value' => 'partial', 'label' => 'Partial'],
            ],
            'urgencies' => [
                ['value' => 'urgent', 'label' => 'Urgent'],
                ['value' => 'normal', 'label' => 'Normal'],
                ['value' => 'low', 'label' => 'Low'],
            ],
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $hospitals = Hospital::select('id', 'name')->get();
        $blood_groups = BloodGroup::select('id', 'name')->get();
        $recipients = Recipient::with('bloodGroup')->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'name' => $r->name,
                'blood_group_id' => $r->blood_group_id
            ];
        });

        return Inertia::render('blood_requests/Create', [
            'bloodGroups' => $blood_groups,
            'hospitals' => $hospitals,
            'recipients' => $recipients
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBloodRequest $request, BloodRequestService $service): RedirectResponse
    {
        $service->createWithItems($request->validated());

        return redirect()->route('blood-requests.index')->with('success', 'Blood request created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BloodRequest $bloodRequest)
    {
        $bloodRequest->load([
            'hospital:id,name,address,contact_person,phone,email',
            'items.bloodGroup:id,name',
            'items.recipient' => function ($query) {
                $query->select('id', 'name', 'id_number', 'date_of_birth', 'gender', 'medical_notes', 'blood_group_id')
                    ->with('bloodGroup:id,name');
            }
        ]);

        $transformedRequest = [
            'id' => $bloodRequest->id,
            'hospital' => [
                'id' => $bloodRequest->hospital->id,
                'name' => $bloodRequest->hospital->name,
                'address' => $bloodRequest->hospital->address,
                'contact_person' => $bloodRequest->hospital->contact_person,
                'phone' => $bloodRequest->hospital->phone,
                'email' => $bloodRequest->hospital->email,
            ],
            'request_date' => $bloodRequest->request_date,
            'notes' => $bloodRequest->notes,
            'status' => $bloodRequest->status,
            'items' => $bloodRequest->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'unique_code' => $item?->unique_code ?? '-',
                    'blood_group' => [
                        'id' => $item?->bloodGroup?->id ?? '-',
                        'name' => $item?->bloodGroup?->name ?? '-',
                    ],
                    'recipient' => $item->recipient ? [
                        'id' => $item->recipient->id,
                        'name' => $item->recipient->name,
                        'id_number' => $item->recipient->id_number,
                        'date_of_birth' => $item->recipient->date_of_birth,
                        'gender' => $item->recipient->gender,
                        'medical_notes' => $item->recipient->medical_notes,
                        'blood_group' => [
                            'id' => $item?->recipient?->bloodGroup?->id ?? '-',
                            'name' => $item?->recipient?->bloodGroup?->name ?? '-',
                        ],
                    ] : null,
                    'units_requested' => $item->units_requested,
                    'urgency' => $item->urgency,
                    'status' => $item->status,
                ];
            }),
            'created_at' => $bloodRequest->created_at,
            'updated_at' => $bloodRequest->updated_at,
        ];

        return Inertia::render('blood_requests/Show', [
            'bloodRequest' => $transformedRequest,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $bloodRequest = BloodRequest::with([
            'hospital:id,name',
            'items' => function ($query) {
                $query->with([
                    'bloodGroup:id,name',
                    'recipient:id,name,id_number,date_of_birth,blood_group_id,medical_notes'
                ]);
            }
        ])->findOrFail($id);

        // Check if user has permission to edit this request
        $user = Auth::user();
        if ($user->user_type === "hospital_staff") {
            $hospital = Hospital::where('user_id', $user->id)->first();
            if ($bloodRequest->hospital_id !== $hospital->id) {
                abort(403, 'Unauthorized access to this blood request.');
            }
        }

        // Check if request can be edited
        if (in_array($bloodRequest->status, ['fulfilled', 'cancelled'])) {
            return redirect()->route('blood-requests.index')
                ->with('error', 'This blood request cannot be edited because it has been ' . $bloodRequest->status);
        }

        $hospitals = Hospital::select('id', 'name')->get();
        $recipients = Recipient::select('id', 'name', 'blood_group_id')->get();
        $bloodGroups = BloodGroup::select('id', 'name')->get();

        return Inertia::render('blood_requests/Edit', [
            'bloodRequest' => [
                'id' => $bloodRequest->id,
                'hospital_id' => $bloodRequest->hospital_id,
                'request_date' => $bloodRequest->request_date,
                'notes' => $bloodRequest->notes,
                'status' => $bloodRequest->status,
                'items' => $bloodRequest->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'blood_group_id' => $item->blood_group_id,
                        'is_general' => $item->recipient_id ? false : true,
                        'units_requested' => $item->units_requested,
                        'urgency' => $item->urgency,
                        'recipient_id' => $item->recipient_id,
                        'recipient' => $item->recipient ? [
                            'id' => $item->recipient->id,
                            'name' => $item->recipient->name,
                            'id_number' => $item->recipient->id_number,
                            'date_of_birth' => $item->recipient->date_of_birth,
                            'blood_group_id' => $item->recipient->blood_group_id,
                            'medical_notes' => $item->recipient->medical_notes,
                        ] : null,
                    ];
                }),
            ],
            'hospitals' => $hospitals,
            'recipients' => $recipients,
            'bloodGroups' => $bloodGroups,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBloodRequest $request, string $id)
    {
        $bloodRequest = BloodRequest::findOrFail($id);

        // All validation and authorization is now handled in UpdateBloodRequest
        $validated = $request->validated();

        try {
            $this->bloodRequestService->updateWithItems($bloodRequest, $validated);

            return redirect()->route('blood-requests.index')
                ->with('success', 'Blood request updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update blood request: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $bloodRequest = BloodRequest::findOrFail($id);

        // Check if user has permission to delete this request
        $user = Auth::user();
        if ($user->user_type === "hospital_staff") {
            $hospital = Hospital::where('user_id', $user->id)->first();
            if ($bloodRequest->hospital_id !== $hospital->id) {
                abort(403, 'Unauthorized access to this blood request.');
            }
        }

        // Check if request can be deleted
        if (in_array($bloodRequest->status, ['approved', 'fulfilled', 'partial'])) {
            return back()->withErrors(['error' => 'This blood request cannot be deleted because it has been ' . $bloodRequest->status]);
        }

        try {
            DB::transaction(function () use ($bloodRequest) {
                // Delete related items first
                $bloodRequest->items()->delete();

                // Delete the blood request
                $bloodRequest->delete();
            });

            return redirect()->route('blood-requests.index')
                ->with('success', 'Blood request deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete blood request: ' . $e->getMessage()]);
        }
    }
}
