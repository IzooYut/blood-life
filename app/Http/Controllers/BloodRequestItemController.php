<?php

namespace App\Http\Controllers;

use App\Models\BloodCenter;
use App\Models\BloodGroup;
use App\Models\BloodRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BloodRequestItemController extends Controller
{

    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'blood_group' => 'nullable|string|max:10',
            'urgency' => 'nullable|string|in:urgent,normal,low',
            'per_page' => 'nullable|integer|min:4|max:20',
            'page' => 'nullable|integer|min:1',
            'sort_by' => 'nullable|string|in:request_date,created_at,urgency',
            'sort_direction' => 'nullable|string|in:asc,desc'
        ]);

        $perPage = $validated['per_page'] ?? 8;
        $sortBy = $validated['sort_by'] ?? 'request_date';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        $query = BloodRequest::query()
            ->with([
                'hospital:id,name,address,contact_person,phone,email',
                'items' => function ($query) {
                    $query->select('id', 'blood_request_id', 'blood_group_id', 'recipient_id', 'units_requested', 'urgency', 'status')
                        ->with(['bloodGroup:id,name', 'recipient:id,name']);
                }
            ])
            ->select('id', 'hospital_id', 'request_date', 'status', 'created_at', 'updated_at');

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->whereHas('hospital', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%");
            });
        }

        if (!empty($validated['blood_group'])) {
            $query->whereHas('items.bloodGroup', function ($q) use ($validated) {
                $q->where('name', $validated['blood_group']);
            });
        }


        if (!empty($validated['urgency'])) {
            $query->whereHas('items', function ($q) use ($validated) {
                $q->where('urgency', $validated['urgency']);
            });
        }

        switch ($sortBy) {
            case 'request_date':
                $query->orderBy('request_date', $sortDirection);
                break;
            case 'urgency':
                $query->whereHas('items', function ($q) use ($sortDirection) {
                    $q->orderByRaw("CASE urgency WHEN 'urgent' THEN 1 WHEN 'normal' THEN 2 WHEN 'low' THEN 3 END " . $sortDirection);
                });
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $bloodRequests = $query->paginate($perPage)->withQueryString();

        // Transform the paginated data to flatten the items
        $transformedItems = collect($bloodRequests->items())
            ->flatMap(function ($request) {
                return $request->items->map(function ($item) use ($request) {
                    return [
                        'id' => $item->id,
                        'blood_request_id' => $request->id,
                        'hospital_name' => $request?->hospital?->name,
                        'recipient_name' => $item?->recipient?->name ?? 'Hospital Request',
                        'bloodGroup' => $item->bloodGroup->name ?? '-',
                        'urgency' => $item->urgency,
                        'location' => $request?->hospital?->location ?? '-',
                        'address' => $request?->hospital?->address ?? '-',
                        'phone' => $request->hospital->phone,
                        'email' => $request->hospital->email,
                        'unitsRequested' => $item->units_requested,
                        'requestDate' => $request->request_date,
                        'status' => $item->status,
                        'hospital' => [
                            'id' => $request->hospital->id,
                            'name' => $request->hospital->name,
                            'address' => $request->hospital->address,
                            'contact_person' => $request->hospital->contact_person,
                            'phone' => $request->hospital->phone,
                            'email' => $request->hospital->email,
                        ],
                        'created_at' => $request->created_at,
                        'updated_at' => $request->updated_at,
                    ];
                });
            })
            ->values();

        // Create a new paginator with the flattened items
        $currentPage = $bloodRequests->currentPage();
        $paginatedItems = new \Illuminate\Pagination\LengthAwarePaginator(
            $transformedItems->forPage($currentPage, $perPage),
            $transformedItems->count(),
            $perPage,
            $currentPage,
            [
                'path' => $request->url(),
                'pageName' => 'page',
            ]
        );

        $filterOptions = $this->getFilterOptions();

        return Inertia::render('blood_requests/FrontIndex', [
            'bloodRequests' => [
                'data' => $paginatedItems->items(),
                'current_page' => $paginatedItems->currentPage(),
                'last_page' => $paginatedItems->lastPage(),
                'per_page' => $paginatedItems->perPage(),
                'total' => $paginatedItems->total(),
                'from' => $paginatedItems->firstItem(),
                'to' => $paginatedItems->lastItem(),
            ],
            'filters' => $validated,
            'filterOptions' => $filterOptions,
        ]);
    }

    private function getFilterOptions(): array
    {
        return [
            'bloodGroups' => BloodGroup::select('id', 'name')
                ->orderBy('name')
                ->get()
                ->map(function ($group) {
                    return [
                        'id' => $group->id,
                        'name' => $group->name,
                    ];
                })
                ->toArray(),
                'bloodCenters' => BloodCenter::select('id', 'name')
                ->latest()
                ->get()
                ->map(function ($center) {
                    return [
                        'id' => $center->id,
                        'name' => $center->name,
                    ];
                })
                ->toArray(),
            'urgencies' => [
                ['value' => 'urgent', 'label' => 'Urgent'],
                ['value' => 'normal', 'label' => 'Normal'],
                ['value' => 'low', 'label' => 'Low'],
            ],
        ];
    }
}
