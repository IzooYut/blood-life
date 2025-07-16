<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BloodGroupSeeder extends Seeder
{
   
    public function run(): void
    {
         $now = Carbon::now();
          $groups = [
            'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
        ];

         foreach ($groups as $group) {
        DB::table('blood_groups')->updateOrInsert(
                ['name' => $group],
                ['updated_at' => $now, 'created_at' => $now]
            );
        }
    }
}
