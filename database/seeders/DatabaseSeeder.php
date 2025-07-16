<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        

        User::factory()->create([
            'first_name' => 'User',
            'last_name'=>'Admin',
            'phone'=>'0209392',
            'gender'=>'male',
            'dob'=>'1994-08-01',
            'email' => 'admin@donationlife.com',
            'password' => Hash::make('password'),
            'is_admin' => true
        ]);

        $this->call([
            BloodGroupSeeder::class
        ]);
    }
}
