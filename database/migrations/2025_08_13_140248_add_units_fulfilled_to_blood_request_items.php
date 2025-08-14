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
            $table->decimal('units_fulfilled')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blood_request_items', function (Blueprint $table) {
            $table->dropColumn('units_fulfilled');
        });
    }
};
