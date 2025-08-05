<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('blood_request_items', function (Blueprint $table) {
            $table->string('unique_code', 20)->unique()->index()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blood_request_items', function (Blueprint $table) {
            $table->dropColumn('unique_code');
        });
    }
};
