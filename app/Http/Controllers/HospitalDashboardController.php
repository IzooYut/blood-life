<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Donation;
use App\Models\BloodRequest;
use App\Models\BloodRequestItem;
use App\Models\Recipient;
use App\Models\Hospital;
use App\Models\BloodGroup;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class HospitalDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
       $user = Auth::user();
        
        // Get the hospital for the logged-in user
        $hospital = Hospital::where('user_id', $user->id)->first();
        
        if (!$hospital) {
            return redirect()->back()->with('error', 'Hospital not found for this user.');
        }
        
        // Get hospital-specific statistics
        $stats = $this->getHospitalStats($hospital->id);
        
        return Inertia::render('hospital-dashboard', [
            'stats' => $stats,
            'hospital' => $hospital
        ]);
    }

    private function getHospitalStats($hospitalId)
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // Basic metrics for hospital
        $metrics = [
            'totalRecipients' => Recipient::where('hospital_id', $hospitalId)->count(),
            'totalBloodRequests' => BloodRequest::where('hospital_id', $hospitalId)->count(),
            'pendingRequests' => BloodRequest::where('hospital_id', $hospitalId)
                ->where('status', 'pending')
                ->count(),
            'approvedRequests' => BloodRequest::where('hospital_id', $hospitalId)
                ->where('status', 'approved')
                ->count(),
            'totalRequestItems' => BloodRequestItem::whereHas('request', function($query) use ($hospitalId) {
                $query->where('hospital_id', $hospitalId);
            })->count(),
            'urgentRequestItems' => BloodRequestItem::whereHas('request', function($query) use ($hospitalId) {
                $query->where('hospital_id', $hospitalId);
            })->whereIn('urgency', ['urgent', 'very_urgent'])
            ->where('status', 'pending')
            ->count(),
            'requestsThisMonth' => BloodRequest::where('hospital_id', $hospitalId)
                ->whereBetween('request_date', [$startOfMonth, $endOfMonth])
                ->count(),
            'recipientsThisMonth' => Recipient::where('hospital_id', $hospitalId)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->count(),
        ];

        // Donations received for this hospital's requests
        $donationsReceived = $this->getDonationsForHospital($hospitalId);
        $metrics['donationsReceived'] = $donationsReceived['total'];
        $metrics['unitsReceived'] = $donationsReceived['units'];

        // Blood group requirements breakdown
        $bloodGroupRequests = $this->getBloodGroupRequests($hospitalId);

        // Request status breakdown
        $requestStatusBreakdown = $this->getRequestStatusBreakdown($hospitalId);

        // Urgency breakdown for pending requests
        $urgencyBreakdown = $this->getUrgencyBreakdown($hospitalId);

        // Monthly request trends
        $monthlyRequests = $this->getMonthlyRequests($hospitalId);

        // Recent recipients
        $recentRecipients = $this->getRecentRecipients($hospitalId);

        // Recent blood requests
        $recentBloodRequests = $this->getRecentBloodRequests($hospitalId);

        // Fulfillment rate
        $fulfillmentRate = $this->getFulfillmentRate($hospitalId);

        return [
            'metrics' => array_merge($metrics, ['fulfillmentRate' => $fulfillmentRate]),
            'bloodGroupRequests' => $bloodGroupRequests,
            'requestStatusBreakdown' => $requestStatusBreakdown,
            'urgencyBreakdown' => $urgencyBreakdown,
            'monthlyRequests' => $monthlyRequests,
            'recentRecipients' => $recentRecipients,
            'recentBloodRequests' => $recentBloodRequests,
        ];
    }

    private function getDonationsForHospital($hospitalId)
    {
        $donations = DB::table('donations')
            ->join('blood_request_items', 'donations.blood_request_item_id', '=', 'blood_request_items.id')
            ->join('blood_requests', 'blood_request_items.blood_request_id', '=', 'blood_requests.id')
            ->where('blood_requests.hospital_id', $hospitalId)
            ->where('donations.screening_status', 'passed')
            ->select(
                DB::raw('count(*) as total'),
                DB::raw('FLOOR(SUM(donations.volume_ml) / 450) as units')
            )
            ->first();

        return [
            'total' => $donations->total ?? 0,
            'units' => $donations->units ?? 0
        ];
    }

    private function getBloodGroupRequests($hospitalId)
    {
        return DB::table('blood_request_items')
            ->join('blood_requests', 'blood_request_items.blood_request_id', '=', 'blood_requests.id')
            ->join('blood_groups', 'blood_request_items.blood_group_id', '=', 'blood_groups.id')
            ->where('blood_requests.hospital_id', $hospitalId)
            ->select(
                'blood_groups.name',
                DB::raw('SUM(blood_request_items.units_requested) as units_requested'),
                DB::raw('count(*) as request_count')
            )
            ->groupBy('blood_groups.id', 'blood_groups.name')
            ->orderBy('units_requested', 'desc')
            ->get()
            ->toArray();
    }

    private function getRequestStatusBreakdown($hospitalId)
    {
        return BloodRequest::where('hospital_id', $hospitalId)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();
    }

    private function getUrgencyBreakdown($hospitalId)
    {
        return DB::table('blood_request_items')
            ->join('blood_requests', 'blood_request_items.blood_request_id', '=', 'blood_requests.id')
            ->where('blood_requests.hospital_id', $hospitalId)
            ->where('blood_request_items.status', 'pending')
            ->select('urgency', DB::raw('count(*) as count'))
            ->groupBy('urgency')
            ->get()
            ->pluck('count', 'urgency')
            ->toArray();
    }

    private function getMonthlyRequests($hospitalId)
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = BloodRequest::where('hospital_id', $hospitalId)
                ->whereYear('request_date', $date->year)
                ->whereMonth('request_date', $date->month)
                ->count();
            
            $months[] = [
                'month' => $date->format('M'),
                'count' => $count,
                'year' => $date->year
            ];
        }
        return $months;
    }

    private function getRecentRecipients($hospitalId)
    {
        return Recipient::with('bloodGroup:id,name')
            ->where('hospital_id', $hospitalId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
    }

    private function getRecentBloodRequests($hospitalId)
    {
        return BloodRequest::with(['items.bloodGroup'])
            ->where('hospital_id', $hospitalId)
            ->has('items') // Only get requests that have items
            ->orderBy('request_date', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($request) {
                // Ensure blood_request_items is always an array
                $request->blood_request_items = $request->bloodRequestItems ?? [];
                return $request;
            });
    }

    private function getFulfillmentRate($hospitalId)
    {
        $totalRequests = BloodRequestItem::whereHas('request', function($query) use ($hospitalId) {
            $query->where('hospital_id', $hospitalId);
        })->count();

        $fulfilledRequests = BloodRequestItem::whereHas('request', function($query) use ($hospitalId) {
            $query->where('hospital_id', $hospitalId);
        })->where('status', 'approved')->count();

        return $totalRequests > 0 ? ($fulfilledRequests / $totalRequests) * 100 : 0;
    }
}
