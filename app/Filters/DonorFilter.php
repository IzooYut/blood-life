<?php

namespace App\Filters;

use App\Models\BloodGroup;
use App\Models\User;
use Illuminate\Http\Request;

class DonorFilter
{
    public function apply($query, Request $request)
    {
        return $query->when(
            $request->filled('search'),
            fn($q) => $q->where(function ($q) use ($request) {
                $q->where('first_name', 'like', '%' . $request->search . '%')
                    ->orWhere('last_name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('phone', 'like', '%' . $request->search . '%');
            })
        )
        ->when(
            $request->filled('gender'),
            fn($q) => $q->where('gender', $request->gender)
        )
        ->when(
            $request->filled('blood_group_id'),
            fn($q) => $q->where('blood_group_id', $request->blood_group_id)
        )
        ->when(
            $request->filled('from_dob'),
            fn($q) => $q->whereDate('dob', '>=', $request->from_dob)
        )
        ->when(
            $request->filled('to_dob'),
            fn($q) => $q->whereDate('dob', '<=', $request->to_dob)
        );
    }

    public function filters(Request $request): array
    {
        return [
            'search' => $request->input('search'),
            'gender' => $request->input('gender'),
            'blood_group_id' => $request->input('blood_group_id'),
            'from_dob' => $request->input('from_dob'),
            'to_dob' => $request->input('to_dob'),
        ];
    }

    public function getFilterLabels(Request $request): array
    {
        $labels = [];

        $filters = $this->filters($request);

        if ($request->filled('search')) {
            $labels[] = 'Search: ' . $filters['search'];
        }

        if ($request->filled('gender')) {
            $labels[] = 'Gender: ' . ucfirst($filters['gender']);
        }

        if ($request->filled('blood_group_id')) {
            $bloodGroup = BloodGroup::find($filters['blood_group_id']);
            if ($bloodGroup) {
                $labels[] = 'Blood Group: ' . $bloodGroup->name;
            }
        }

        if ($request->filled('from_dob')) {
            $labels[] = 'DOB From: ' . $filters['from_dob'];
        }

        if ($request->filled('to_dob')) {
            $labels[] = 'DOB To: ' . $filters['to_dob'];
        }

        return $labels;
    }
}
