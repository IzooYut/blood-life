<?php

namespace App\Traits;

use App\Models\BloodRequest;
use App\Models\Hospital;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

trait HasHospitalBloodRequests
{
    /**
     * Get the hospital for the currently authenticated user
     */
    public function getCurrentHospital()
    {
        if (!Auth::check()) {
            return null;
        }

        // Cache the hospital lookup for the session to avoid repeated queries
        return Cache::remember(
            'hospital_for_user_' . Auth::id(),
            now()->addMinutes(30),
            function () {
                return Hospital::where('user_id', Auth::id())->first();
            }
        );
    }

    /**
     * Check if the current user belongs to a hospital
     */
    public function isHospitalUser(): bool
    {
        return $this->getCurrentHospital() !== null;
    }

    /**
     * Get blood requests for the current hospital
     */
    public function getHospitalBloodRequests()
    {
        $hospital = $this->getCurrentHospital();
        
        if (!$hospital) {
            return BloodRequest::whereRaw('1 = 0'); // Return empty query
        }

        return BloodRequest::where('hospital_id', $hospital->id);
    }

    /**
     * Get blood requests with items for the current hospital
     */
    public function getHospitalBloodRequestsWithItems()
    {
        return $this->getHospitalBloodRequests()
            ->with([
                'items' => function ($query) {
                    $query->with([
                        'bloodGroup:id,name,abo_type,rh_factor',
                        'recipient:id,name,medical_record_number',
                        'donations' => function ($donationQuery) {
                            $donationQuery->where('screening_status', 'passed');
                        }
                    ]);
                },
                'hospital:id,name,contact_person,phone'
            ]);
    }

    /**
     * Get active blood requests for the current hospital
     */
    public function getActiveHospitalBloodRequests()
    {
        return $this->getHospitalBloodRequests()
            ->where('status', '!=', 'fulfilled')
            ->with([
                'items' => function ($query) {
                    $query->where('status', '!=', 'fulfilled')
                          ->with(['bloodGroup', 'recipient']);
                }
            ]);
    }

    /**
     * Get urgent blood requests for the current hospital
     */
    public function getUrgentHospitalBloodRequests()
    {
        return $this->getHospitalBloodRequests()
            ->whereHas('items', function ($query) {
                $query->where('urgency', 'urgent')
                      ->where('status', '!=', 'fulfilled');
            })
            ->with([
                'items' => function ($query) {
                    $query->where('urgency', 'urgent')
                          ->where('status', '!=', 'fulfilled')
                          ->with(['bloodGroup', 'recipient']);
                }
            ]);
    }

    /**
     * Get blood requests by status for the current hospital
     */
    public function getHospitalBloodRequestsByStatus(string $status)
    {
        return $this->getHospitalBloodRequests()
            ->where('status', $status)
            ->with(['items.bloodGroup', 'items.recipient']);
    }

    /**
     * Get blood requests within date range for the current hospital
     */
    public function getHospitalBloodRequestsByDateRange($startDate, $endDate)
    {
        return $this->getHospitalBloodRequests()
            ->whereBetween('request_date', [$startDate, $endDate])
            ->with(['items.bloodGroup', 'items.recipient']);
    }

    /**
     * Get paginated blood requests for the current hospital with filters
     */
    public function getPaginatedHospitalBloodRequests(array $filters = [], int $perPage = 15)
    {
        $query = $this->getHospitalBloodRequests();

        // Apply filters
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('notes', 'like', $searchTerm)
                  ->orWhereHas('items', function ($itemQuery) use ($searchTerm) {
                      $itemQuery->whereHas('recipient', function ($recipientQuery) use ($searchTerm) {
                          $recipientQuery->where('name', 'like', $searchTerm)
                                        ->orWhere('medical_record_number', 'like', $searchTerm);
                      });
                  });
            });
        }

        if (!empty($filters['urgency'])) {
            $query->whereHas('items', function ($itemQuery) use ($filters) {
                $itemQuery->where('urgency', $filters['urgency']);
            });
        }

        if (!empty($filters['blood_group_id'])) {
            $query->whereHas('items', function ($itemQuery) use ($filters) {
                $itemQuery->where('blood_group_id', $filters['blood_group_id']);
            });
        }

        if (!empty($filters['date_from'])) {
            $query->where('request_date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('request_date', '<=', $filters['date_to']);
        }

        // Apply sorting
        $sortBy = $filters['sort_by'] ?? 'request_date';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        
        $query->orderBy($sortBy, $sortDirection);

        // Load relationships
        $query->with([
            'items' => function ($itemQuery) {
                $itemQuery->with([
                    'bloodGroup:id,name,abo_type,rh_factor',
                    'recipient:id,name,medical_record_number',
                    'donations' => function ($donationQuery) {
                        $donationQuery->where('screening_status', 'passed')
                                    ->select('id', 'blood_request_item_id', 'volume_ml');
                    }
                ]);
            }
        ]);

        return $query->paginate($perPage);
    }

    /**
     * Get hospital blood request statistics
     */
    public function getHospitalBloodRequestStats()
    {
        $hospital = $this->getCurrentHospital();
        
        if (!$hospital) {
            return null;
        }

        // Cache stats for 10 minutes to improve performance
        return Cache::remember(
            'hospital_blood_request_stats_' . $hospital->id,
            now()->addMinutes(10),
            function () use ($hospital) {
                $baseQuery = BloodRequest::where('hospital_id', $hospital->id);
                
                return [
                    'total_requests' => $baseQuery->count(),
                    'active_requests' => $baseQuery->where('status', '!=', 'fulfilled')->count(),
                    'fulfilled_requests' => $baseQuery->where('status', 'fulfilled')->count(),
                    'pending_requests' => $baseQuery->where('status', 'pending')->count(),
                    
                    // Item-level statistics
                    'total_items' => $hospital->bloodRequests()->withCount('items')->get()->sum('items_count'),
                    'urgent_items' => $hospital->bloodRequests()
                        ->join('blood_request_items', 'blood_requests.id', '=', 'blood_request_items.blood_request_id')
                        ->where('blood_request_items.urgency', 'urgent')
                        ->where('blood_request_items.status', '!=', 'fulfilled')
                        ->count(),
                    
                    'total_units_requested' => $hospital->bloodRequests()
                        ->join('blood_request_items', 'blood_requests.id', '=', 'blood_request_items.blood_request_id')
                        ->sum('blood_request_items.units_requested'),
                    
                    // Recent activity
                    'requests_this_month' => $baseQuery->whereMonth('request_date', date('m'))
                                                     ->whereYear('request_date', date('Y'))
                                                     ->count(),
                    
                    'requests_this_week' => $baseQuery->whereBetween('request_date', [
                                                         now()->startOfWeek(),
                                                         now()->endOfWeek()
                                                     ])->count(),
                ];
            }
        );
    }

    /**
     * Create a new blood request for the current hospital
     */
    public function createHospitalBloodRequest(array $data)
    {
        $hospital = $this->getCurrentHospital();
        
        if (!$hospital) {
            throw new \Exception('User is not associated with any hospital');
        }

        $data['hospital_id'] = $hospital->id;
        
        return BloodRequest::create($data);
    }

    /**
     * Check if current user can access a specific blood request
     */
    public function canAccessBloodRequest($bloodRequestId): bool
    {
        $hospital = $this->getCurrentHospital();
        
        if (!$hospital) {
            return false;
        }

        return BloodRequest::where('id', $bloodRequestId)
                          ->where('hospital_id', $hospital->id)
                          ->exists();
    }

    /**
     * Get blood requests by blood group for the current hospital
     */
    public function getHospitalBloodRequestsByBloodGroup($bloodGroupId)
    {
        return $this->getHospitalBloodRequests()
            ->whereHas('items', function ($query) use ($bloodGroupId) {
                $query->where('blood_group_id', $bloodGroupId);
            })
            ->with([
                'items' => function ($query) use ($bloodGroupId) {
                    $query->where('blood_group_id', $bloodGroupId)
                          ->with(['bloodGroup', 'recipient']);
                }
            ]);
    }

    /**
     * Get overdue blood requests for the current hospital
     */
    public function getOverdueHospitalBloodRequests()
    {
        return $this->getHospitalBloodRequests()
            ->whereHas('items', function ($query) {
                $query->whereNotNull('required_by_date')
                      ->where('required_by_date', '<', now())
                      ->where('status', '!=', 'fulfilled');
            })
            ->with([
                'items' => function ($query) {
                    $query->whereNotNull('required_by_date')
                          ->where('required_by_date', '<', now())
                          ->where('status', '!=', 'fulfilled')
                          ->with(['bloodGroup', 'recipient'])
                          ->orderBy('required_by_date');
                }
            ]);
    }

    /**
     * Clear hospital cache (call this when hospital data changes)
     */
    public function clearHospitalCache()
    {
        if (Auth::check()) {
            Cache::forget('hospital_for_user_' . Auth::id());
            
            $hospital = $this->getCurrentHospital();
            if ($hospital) {
                Cache::forget('hospital_blood_request_stats_' . $hospital->id);
            }
        }
    }
}