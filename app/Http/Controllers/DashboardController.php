<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Donation;
use App\Models\Appointment;
use App\Models\BloodRequest;
use App\Models\BloodRequestItem;
use App\Models\Hospital;
use App\Models\BloodCenter;
use App\Models\BloodGroup;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $stats = $this->getDashboardStats();
        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }

    private function getDashboardStats()
    {
        // Current date for filtering
        $now = Carbon::now();
        $startOfWeek = $now->copy()->startOfWeek();
        $endOfWeek = $now->copy()->endOfWeek();

        // Basic metrics
        $metrics = [
            'totalDonors' => User::where('user_type', 'donor')->count(),
            'activeAppointments' => Appointment::whereBetween('appointment_date', [$startOfWeek, $endOfWeek])
                ->whereIn('status', ['scheduled', 'confirmed'])
                ->count(),
            'requestsFulfilled' => BloodRequestItem::where('status', 'approved')->count(),
            'hospitals' => Hospital::count(),
            'donations' => Donation::where('screening_status', 'passed')->count(),
            'bloodUnits' => $this->getAvailableBloodUnits(),
        ];

        // Additional metrics for enhanced dashboard
        $additionalMetrics = [
            'totalBloodCenters' => BloodCenter::count(),
            'pendingRequests' => BloodRequestItem::where('status', 'pending')->count(),
            'urgentRequests' => BloodRequestItem::where('status', 'pending')
                ->whereIn('urgency', ['urgent', 'very_urgent'])
                ->count(),
            'donationsThisMonth' => Donation::where('screening_status', 'passed')
                ->whereMonth('donation_date_time', $now->month)
                ->whereYear('donation_date_time', $now->year)
                ->count(),
            'averageDonationVolume' => Donation::where('screening_status', 'passed')
                ->avg('volume_ml'),
        ];

        // Top blood groups by available units
        $topBloodGroups = $this->getTopBloodGroups();

        // Donations per month (last 12 months)
        $donationsPerMonth = $this->getDonationsPerMonth();

        // Request fulfillment trend (last 6 months)
        $requestFulfillment = $this->getRequestFulfillmentTrend();

        // Blood group distribution
        $bloodGroupDistribution = $this->getBloodGroupDistribution();

        // Recent activities
        $recentDonations = $this->getRecentDonations();
        $upcomingAppointments = $this->getUpcomingAppointments();

        // Urgency breakdown
        $urgencyBreakdown = $this->getUrgencyBreakdown();

        return [
            'metrics' => array_merge($metrics, $additionalMetrics),
            'topBloodGroups' => $topBloodGroups,
            'donationsPerMonth' => $donationsPerMonth,
            'requestFulfillment' => $requestFulfillment,
            'bloodGroupDistribution' => $bloodGroupDistribution,
            'recentDonations' => $recentDonations,
            'upcomingAppointments' => $upcomingAppointments,
            'urgencyBreakdown' => $urgencyBreakdown,
        ];
    }

    private function getAvailableBloodUnits()
    {
        // Calculate available blood units (donations - fulfilled requests)
        $totalDonated = Donation::where('screening_status', 'passed')
            ->sum('volume_ml');

        return $totalDonated;

        // Convert ml to units (assuming 450ml per unit)
        // return floor($totalDonated / 450);
    }

    private function getTopBloodGroups()
    {
        return DB::table('donations')
            ->join('users', 'donations.user_id', '=', 'users.id')
            ->join('blood_groups', 'users.blood_group_id', '=', 'blood_groups.id')
            ->where('donations.screening_status', 'passed')
            ->select('blood_groups.name', DB::raw('FLOOR(SUM(donations.volume_ml) / 450) as units'))
            ->groupBy('blood_groups.id', 'blood_groups.name')
            ->orderBy('units', 'desc')
            ->limit(8)
            ->get()
            ->toArray();
    }

    private function getDonationsPerMonth()
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = Donation::where('screening_status', 'passed')
                ->whereYear('donation_date_time', $date->year)
                ->whereMonth('donation_date_time', $date->month)
                ->count();

            $months[] = [
                'month' => $date->format('M'),
                'count' => $count,
                'year' => $date->year
            ];
        }
        return $months;
    }

    private function getRequestFulfillmentTrend()
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $fulfilled = BloodRequestItem::where('status', 'approved')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $months[] = [
                'month' => $date->format('M'),
                'fulfilled' => $fulfilled,
                'year' => $date->year
            ];
        }
        return $months;
    }

    private function getBloodGroupDistribution()
    {
        return DB::table('users')
            ->join('blood_groups', 'users.blood_group_id', '=', 'blood_groups.id')
            ->where('users.user_type', 'donor')
            ->select('blood_groups.name', DB::raw('count(*) as count'))
            ->groupBy('blood_groups.id', 'blood_groups.name')
            ->orderBy('count', 'desc')
            ->get()
            ->toArray();
    }

    private function getRecentDonations()
    {
        return Donation::with(['donor:id,name,email', 'bloodCenter:id,name'])
            ->join('users', 'donations.user_id', '=', 'users.id')
            ->join('blood_groups', 'users.blood_group_id', '=', 'blood_groups.id')
            ->select('donations.*', 'users.name as donor_name', 'blood_groups.name as blood_group')
            ->where('donations.screening_status', 'passed')
            ->orderBy('donations.donation_date_time', 'desc')
            ->limit(5)
            ->get();
    }

    private function getUpcomingAppointments()
    {
        return Appointment::with(['user:id,name,email', 'blood_center:id,name'])
            ->join('users', 'appointments.user_id', '=', 'users.id')
            ->leftJoin('blood_groups', 'users.blood_group_id', '=', 'blood_groups.id')
            ->select('appointments.*', 'users.name as donor_name', 'blood_groups.name as blood_group')
            ->where('appointments.appointment_date', '>=', Carbon::today())
            ->whereIn('appointments.status', ['scheduled', 'confirmed'])
            ->orderBy('appointments.appointment_date')
            ->limit(5)
            ->get();
    }

    private function getUrgencyBreakdown()
    {
        return BloodRequestItem::where('status', 'pending')
            ->select('urgency', DB::raw('count(*) as count'))
            ->groupBy('urgency')
            ->get()
            ->pluck('count', 'urgency')
            ->toArray();
    }
}
