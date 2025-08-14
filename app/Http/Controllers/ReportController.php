<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use App\Services\Exports\PdfExportService;
use App\Services\Exports\ExcelExportService;
use App\Models\User;
use App\Models\Recipient;
use App\Models\BloodRequestItem;
use App\Models\Donation;
use App\Models\Hospital;
use App\Models\BloodCenter;
use App\Models\BloodGroup;
use Carbon\Carbon;

class ReportController extends Controller
{
    protected $pdfExportService;
    protected $excelExportService;

    public function __construct(PdfExportService $pdfExportService, ExcelExportService $excelExportService)
    {
        $this->pdfExportService = $pdfExportService;
        $this->excelExportService = $excelExportService;
    }

    public function export(Request $request, string $type, string $format)
    {
        $filters = $request->only([
            'start_date',
            'end_date',
            'hospital_id',
            'blood_center_id',
            'status',
            'recipient_id',
            'blood_group_id'
        ]);

        $config = [
            'donors' => [
                'query' => function ($filters) {
                    return User::where('user_type', 'donor')
                        ->with('bloodGroup')
                        ->when(!empty($filters['start_date']), fn($q) => $q->whereDate('created_at', '>=', $filters['start_date']))
                        ->when(!empty($filters['end_date']), fn($q) => $q->whereDate('created_at', '<=', $filters['end_date']))
                        ->when(!empty($filters['blood_group_id']), fn($q) => $q->where('blood_group_id', $filters['blood_group_id']))
                        ->select('name', 'email', 'blood_group_id', 'phone', 'created_at');
                },
                'columns' => ['Name', 'Email', 'Blood Group', 'Phone', 'Registered On'],
                'title' => 'Blood Donors List',
                'map' => fn($row) => [
                    $row->name,
                    $row->email,
                    $row->bloodGroup?->name ?? '-',
                    $row->phone ?? '-',
                    $row->created_at->format('Y-m-d H:i'),
                ],
                'summary' => fn($q) => ['Total Donors', '', '', '', $q->count()],
            ],

            'recipients' => [
                'query' => function ($filters) {
                    return Recipient::with(['bloodGroup', 'hospital'])
                        ->when(!empty($filters['start_date']), fn($q) => $q->whereDate('created_at', '>=', $filters['start_date']))
                        ->when(!empty($filters['end_date']), fn($q) => $q->whereDate('created_at', '<=', $filters['end_date']))
                        ->when(!empty($filters['blood_group_id']), fn($q) => $q->where('blood_group_id', $filters['blood_group_id']))
                        ->when(!empty($filters['hospital_id']), fn($q) => $q->where('hospital_id', $filters['hospital_id']))
                        ->select('name', 'blood_group_id', 'hospital_id', 'date_of_birth', 'gender', 'medical_notes', 'created_at');
                },
                'columns' => ['Name', 'Blood Group', 'Hospital', 'Date of Birth', 'Gender', 'Medical Notes', 'Registered On'],
                'title' => 'Recipients List',
                'map' => fn($row) => [
                    $row->name,
                    $row->bloodGroup?->name ?? '-',
                    $row->hospital?->name ?? '-',
                    $row->date_of_birth ?? '-',
                    $row->gender ?? '-',
                    $row->medical_notes ?? '-',
                    $row->created_at->format('Y-m-d H:i'),
                ],
                'summary' => fn($q) => ['Total Recipients', '', '', '', $q->count()],
            ],
            'hospitals' => [
                'query' => function ($filters) {
                    return Hospital::with(['bloodRequests'])
                        ->when(!empty($filters['start_date']), fn($q) => $q->whereDate('created_at', '>=', $filters['start_date']))
                        ->when(!empty($filters['end_date']), fn($q) => $q->whereDate('created_at', '<=', $filters['end_date']))
                        ->select('name', 'address', 'contact_person', 'phone', 'email', 'created_at');
                },
                'columns' => ['Name', 'Address', 'Contact Person', 'Phone', 'Email', 'Registered On'],
                'title' => 'Hospitals List',
                'map' => fn($row) => [
                    $row->name,
                    $row->address ?? '-',
                    $row->contact_person ?? '-',
                    $row->phone ?? '-',
                    $row->email ?? '-',
                    $row->created_at->format('Y-m-d H:i'),
                ],
                'summary' => fn($q) => ['Total Hospitals', '', '', '', $q->count()],
            ],
            'appointments' => [
                'query' => function ($filters) {
                    return Appointment::with(['user.bloodGroup', 'blood_center'])
                        ->when(!empty($filters['start_date']), fn($q) => $q->whereDate('created_at', '>=', $filters['start_date']))
                        ->when(!empty($filters['end_date']), fn($q) => $q->whereDate('created_at', '<=', $filters['end_date']))
                        ->select('user_id', 'blood_center_id', 'appointment_date', 'status', 'notes', 'created_at');
                },
                'columns' => ['Donor', 'Blood Center', 'Blood Group', 'Appointment Date', 'Status', 'Date Booked'],
                'title' => 'Appointments List',
                'map' => fn($row) => [
                    $row?->user?->name ?? '-',
                    $row?->blood_center?->name ?? '-',
                    $row?->user?->bloodGroup?->name ?? '-',
                    $row->appointment_date ?? '-',
                    $row->status ?? '-',
                    $row->created_at->format('Y-m-d H:i'),
                ],
                'summary' => fn($q) => ['Total Appointments', '', '', '', $q->count()],
            ],
            'requests' => [
                'query' => function ($filters) {
                    return BloodRequestItem::with(['bloodGroup', 'recipient', 'request.hospital'])
                        ->when(!empty($filters['start_date']), fn($q) => $q->whereDate('created_at', '>=', $filters['start_date']))
                        ->when(!empty($filters['end_date']), fn($q) => $q->whereDate('created_at', '<=', $filters['end_date']))
                        ->when(!empty($filters['status']), fn($q) => $q->where('status', $filters['status']))
                        ->when(!empty($filters['recipient_id']), fn($q) => $q->where('recipient_id', $filters['recipient_id']))
                        ->when(!empty($filters['blood_group_id']), fn($q) => $q->where('blood_group_id', $filters['blood_group_id']))
                        ->when(!empty($filters['hospital_id']), fn($q) => $q->whereHas('request', fn($rq) => $rq->where('hospital_id', $filters['hospital_id'])))
                        ->select('blood_group_id', 'recipient_id', 'blood_request_id', 'units_requested', 'status', 'created_at');
                },
                'columns' => ['Recipient', 'Blood Group', 'Units Requested', 'Hospital', 'Status', 'Requested On'],
                'title' => 'Blood Requests',
                'map' => fn($row) => [
                    $row->recipient?->name ?? '-',
                    $row->bloodGroup?->name ?? '-',
                    $row->units_requested,
                    $row->request?->hospital?->name ?? '-',
                    ucfirst($row->status),
                    $row->created_at->format('Y-m-d H:i'),
                ],
                'summary' => fn($q) => [
                    'Total Requests',
                    '',
                    $q->sum('units_requested') . ' units',
                    '',
                    '',
                    $q->count() . ' requests',
                ],
            ],

            'donations' => [
                'query' => function ($filters) {
                    return Donation::with(['donor.bloodGroup', 'bloodGroup', 'bloodCenter'])
                        ->when(!empty($filters['start_date']), fn($q) => $q->whereDate('donation_date_time', '>=', $filters['start_date']))
                        ->when(!empty($filters['end_date']), fn($q) => $q->whereDate('donation_date_time', '<=', $filters['end_date']))
                        ->when(!empty($filters['status']), fn($q) => $q->where('screening_status', $filters['status']))
                        ->when(!empty($filters['blood_center_id']), fn($q) => $q->where('blood_center_id', $filters['blood_center_id']))
                        ->when(!empty($filters['blood_group_id']), fn($q) => $q->where('blood_group_id', $filters['blood_group_id']))
                        ->select('user_id', 'blood_group_id', 'blood_center_id', 'volume_ml', 'donation_date_time', 'screening_status');
                },
                'columns' => ['Donor', 'Blood Group', 'Volume (ml)', 'Blood Center', 'Donation Date', 'Screening Status', 'Notes'],
                'title' => 'Donations List',
                'map' => fn($row) => [
                    $row?->donor?->name ?? '-',
                    $row?->donor?->bloodGroup?->name ?? '-',
                    $row->volume_ml,
                    $row->bloodCenter?->name ?? '-',
                    $row->donation_date_time?->format('Y-m-d H:i') ?? '-',
                    ucfirst($row->screening_status ?? '-'),
                    $row?->notes ?? '-',
                ],
                'summary' => fn($q) => [
                    'Total Donations',
                    '',
                    $q->sum('volume_ml') . ' ml',
                    '',
                    '',
                    $q->count() . ' donations',
                ],
            ],

            'blood_centers' => [
                'query' => function ($filters) {
                    return BloodCenter::query()
                        ->select('id', 'name', 'contact_person', 'email', 'phone', 'location', 'address', 'created_at')
                        ->withCount(['donations', 'appointments'])
                        ->when(!empty($filters['start_date']), fn($q) => $q->whereDate('created_at', '>=', $filters['start_date']))
                        ->when(!empty($filters['end_date']), fn($q) => $q->whereDate('created_at', '<=', $filters['end_date']));
                },
                'columns' => ['Name', 'Contact Person', 'Email', 'Phone', 'Location', 'Address', 'No Of Donations', 'No Of Appointments', 'Registered On'],
                'title' => 'Blood Centers List',
                'map' => fn($row) => [
                    $row->name,
                    $row->contact_person ?? '-',
                    $row->email ?? '-',
                    $row->phone ?? '-',
                    $row->location ?? '-',
                    $row->address ?? '-',
                    $row->donations_count ?? '-',
                    $row->appointments_count ?? '-',
                    $row->created_at->format('Y-m-d H:i'),
                ],
                'summary' => fn($q) => ['Total Blood Centers', '', '', '', $q->count()],
            ]

        ];

        if (!isset($config[$type])) {
            abort(404, 'Invalid report type');
        }

        $settings = $config[$type];
        $query = $settings['query']($filters);
        $data = $query->get()->map($settings['map'])->toArray();
        $summary = $settings['summary'] ? call_user_func($settings['summary'], $settings['query']($filters)) : null;

        // Resolve names for filters in title
        $title = $this->generateTitleWithNames($settings['title'], $filters);

        return $format === 'pdf'
            ? $this->pdfExportService->export($title, $settings['columns'], $data, $summary)
            : $this->excelExportService->export($title, $settings['columns'], $data, $summary);
    }

    private function generateTitleWithNames(string $baseTitle, array $filters): string
    {
        $parts = [$baseTitle];

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $parts[] = "From {$filters['start_date']} to {$filters['end_date']}";
        } elseif (!empty($filters['start_date'])) {
            $parts[] = "From {$filters['start_date']}";
        } elseif (!empty($filters['end_date'])) {
            $parts[] = "Up to {$filters['end_date']}";
        }

        if (!empty($filters['status'])) {
            $parts[] = "Status: " . ucfirst($filters['status']);
        }
        if (!empty($filters['hospital_id'])) {
            $hospitalName = Hospital::find($filters['hospital_id'])?->name ?? "Hospital #{$filters['hospital_id']}";
            $parts[] = "Hospital: {$hospitalName}";
        }
        if (!empty($filters['blood_center_id'])) {
            $centerName = BloodCenter::find($filters['blood_center_id'])?->name ?? "Center #{$filters['blood_center_id']}";
            $parts[] = "Blood Center: {$centerName}";
        }
        if (!empty($filters['recipient_id'])) {
            $recipientName = Recipient::find($filters['recipient_id'])?->name ?? "Recipient #{$filters['recipient_id']}";
            $parts[] = "Recipient: {$recipientName}";
        }
        if (!empty($filters['blood_group_id'])) {
            $bloodGroupName = BloodGroup::find($filters['blood_group_id'])?->name ?? "Blood Group #{$filters['blood_group_id']}";
            $parts[] = "Blood Group: {$bloodGroupName}";
        }

        return implode(' | ', $parts);
    }
}
