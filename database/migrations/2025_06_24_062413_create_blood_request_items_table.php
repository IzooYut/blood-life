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
        Schema::create('blood_request_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('blood_request_id')->index();
            $table->unsignedBigInteger('blood_group_id')->nullable()->index();
            $table->unsignedBigInteger('recipient_id')->nullable()->index();
            $table->decimal('units_requested');
            $table->enum('urgency', ['normal', 'urgent', 'very_urgent'])->index();
            $table->enum('status', ['pending', 'approved', 'cancelled'])->nullable()->index();
            $table->trackUserActions();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blood_request_items');
    }
};
