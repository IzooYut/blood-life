<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Donation;
use App\Models\Appointment;
use App\Models\BloodCenter;
use App\Models\BloodGroup;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class BloodCenterDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
         $user = Auth::user();
        
        // Get the blood center for the logged-in user
        $bloodCenter = BloodCenter::where('user_id', $user->id)->first();
        
        if (!$bloodCenter) {
            return redirect()->back()->with('error', 'Blood center not found for this user.');
        }
        
        // Get blood center-specific statistics
        $stats = $this->getBloodCenterStats($bloodCenter->id);
        
        return Inertia::render('blood-center-dashboard', [
            'stats' => $stats,
            'bloodCenter' => $bloodCenter
        ]);
    }

     private function getBloodCenterStats($bloodCenterId)
    {
        $now = Carbon::now();
        $startOfWeek = $now->copy()->startOfWeek();
        $endOfWeek = $now->copy()->endOfWeek();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startOfDay = $now->copy()->startOfDay();
        $endOfDay = $now->copy()->endOfDay();

        // Basic metrics for blood center
        $metrics = [
            'totalDonations' => Donation::where('blood_center_id', $bloodCenterId)
                ->where('screening_status', 'passed')
                ->count(),
            'donationsToday' => Donation::where('blood_center_id', $bloodCenterId)
                ->where('screening_status', 'passed')
                ->whereBetween('donation_date_time', [$startOfDay, $endOfDay])
                ->count(),
            'donationsThisWeek' => Donation::where('blood_center_id', $bloodCenterId)
                ->where('screening_status', 'passed')
                ->whereBetween('donation_date_time', [$startOfWeek, $endOfWeek])
                ->count(),
            'donationsThisMonth' => Donation::where('blood_center_id', $bloodCenterId)
                ->where('screening_status', 'passed')
                ->whereBetween('donation_date_time', [$startOfMonth, $endOfMonth])
                ->count(),
            'totalAppointments' => Appointment::where('blood_center_id', $bloodCenterId)->count(),
            'todayAppointments' => Appointment::where('blood_center_id', $bloodCenterId)
                ->whereDate('appointment_date', $now->toDateString())
                ->count(),
            'upcomingAppointments' => Appointment::where('blood_center_id', $bloodCenterId)
                ->where('appointment_date', '>=', $now)
                ->whereIn('status', ['scheduled', 'confirmed'])
                ->count(),
            'completedAppointments' => Appointment::where('blood_center_id', $bloodCenterId)
                ->where('status', 'completed')
                ->count(),
        ];

        // Blood units collected
        $bloodUnitsData = $this->getBloodUnitsCollected($bloodCenterId);
        $metrics['totalBloodUnits'] = $bloodUnitsData['total_units'];
        $metrics['averageDonationVolume'] = $bloodUnitsData['average_volume'];

        // Screening status breakdown
        $screeningBreakdown = $this->getScreeningBreakdown($bloodCenterId);

        // Appointment status breakdown
        $appointmentStatusBreakdown = $this->getAppointmentStatusBreakdown($bloodCenterId);

        // Blood group donations breakdown
        $bloodGroupDonations = $this->getBloodGroupDonations($bloodCenterId);

        // Monthly donation trends
        $monthlyDonations = $this->getMonthlyDonations($bloodCenterId);

        // Weekly appointment trends
        $weeklyAppointments = $this->getWeeklyAppointments($bloodCenterId);

        // Recent donations
        $recentDonations = $this->getRecentDonations($bloodCenterId);

        // Upcoming appointments
        $upcomingAppointmentsList = $this->getUpcomingAppointments($bloodCenterId);

        // Donation conversion rate (appointments to donations)
        $conversionRate = $this->getDonationConversionRate($bloodCenterId);
        $metrics['conversionRate'] = $conversionRate;

        return [
            'metrics' => $metrics,
            'screeningBreakdown' => $screeningBreakdown,
            'appointmentStatusBreakdown' => $appointmentStatusBreakdown,
            'bloodGroupDonations' => $bloodGroupDonations,
            'monthlyDonations' => $monthlyDonations,
            'weeklyAppointments' => $weeklyAppointments,
            'recentDonations' => $recentDonations,
            'upcomingAppointments' => $upcomingAppointmentsList,
        ];
    }

    private function getBloodUnitsCollected($bloodCenterId)
    {
        $data = DB::table('donations')
            ->where('blood_center_id', $bloodCenterId)
            ->where('screening_status', 'passed')
            ->select(
                DB::raw('FLOOR(SUM(volume_ml) / 450) as total_units'),
                DB::raw('AVG(volume_ml) as average_volume')
            )
            ->first();

        return [
            'total_units' => $data->total_units ?? 0,
            'average_volume' => round($data->average_volume ?? 0, 2)
        ];
    }

    private function getScreeningBreakdown($bloodCenterId)
    {
        return Donation::where('blood_center_id', $bloodCenterId)
            ->select('screening_status', DB::raw('count(*) as count'))
            ->groupBy('screening_status')
            ->get()
            ->pluck('count', 'screening_status')
            ->toArray();
    }

    private function getAppointmentStatusBreakdown($bloodCenterId)
    {
        return Appointment::where('blood_center_id', $bloodCenterId)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();
    }

    private function getBloodGroupDonations($bloodCenterId)
    {
        return DB::table('donations')
            ->join('users', 'donations.user_id', '=', 'users.id')
            ->join('blood_groups', 'users.blood_group_id', '=', 'blood_groups.id')
            ->where('donations.blood_center_id', $bloodCenterId)
            ->where('donations.screening_status', 'passed')
            ->select(
                'blood_groups.name',
                DB::raw('count(*) as donations_count'),
                DB::raw('FLOOR(SUM(donations.volume_ml) / 450) as units')
            )
            ->groupBy('blood_groups.id', 'blood_groups.name')
            ->orderBy('donations_count', 'desc')
            ->get()
            ->toArray();
    }

    private function getMonthlyDonations($bloodCenterId)
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = Donation::where('blood_center_id', $bloodCenterId)
                ->where('screening_status', 'passed')
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

    private function getWeeklyAppointments($bloodCenterId)
    {
        $weeks = [];
        for ($i = 7; $i >= 0; $i--) {
            $startOfWeek = Carbon::now()->subWeeks($i)->startOfWeek();
            $endOfWeek = Carbon::now()->subWeeks($i)->endOfWeek();
            
            $count = Appointment::where('blood_center_id', $bloodCenterId)
                ->whereBetween('appointment_date', [$startOfWeek, $endOfWeek])
                ->count();
            
            $weeks[] = [
                'week' => 'Week ' . (8 - $i),
                'count' => $count,
                'date' => $startOfWeek->format('M d')
            ];
        }
        return $weeks;
    }

    private function getRecentDonations($bloodCenterId)
    {
        return Donation::with(['donor:id,name,email'])
            ->join('users', 'donations.user_id', '=', 'users.id')
            ->leftJoin('blood_groups', 'users.blood_group_id', '=', 'blood_groups.id')
            ->select('donations.*', 'users.name as donor_name', 'blood_groups.name as blood_group')
            ->where('donations.blood_center_id', $bloodCenterId)
            ->orderBy('donations.donation_date_time', 'desc')
            ->limit(5)
            ->get();
    }

    private function getUpcomingAppointments($bloodCenterId)
    {
        return Appointment::with(['user:id,name,email'])
            ->join('users', 'appointments.user_id', '=', 'users.id')
            ->leftJoin('blood_groups', 'users.blood_group_id', '=', 'blood_groups.id')
            ->select('appointments.*', 'users.name as donor_name', 'blood_groups.name as blood_group')
            ->where('appointments.blood_center_id', $bloodCenterId)
            ->where('appointments.appointment_date', '>=', Carbon::today())
            ->whereIn('appointments.status', ['scheduled', 'confirmed'])
            ->orderBy('appointments.appointment_date')
            ->limit(10)
            ->get();
    }

    private function getDonationConversionRate($bloodCenterId)
    {
        $totalAppointments = Appointment::where('blood_center_id', $bloodCenterId)
            ->where('status', 'completed')
            ->count();

        $donationsFromAppointments = Donation::where('blood_center_id', $bloodCenterId)
            ->whereNotNull('appointment_id')
            ->where('screening_status', 'passed')
            ->count();

        return $totalAppointments > 0 ? ($donationsFromAppointments / $totalAppointments) * 100 : 0;
    }
}
