<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use phpDocumentor\Reflection\Types\Nullable;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->unsignedBigInteger('blood_center_id')->index();
            $table->unsignedBigInteger('blood_request_item_id')->nullable();
            $table->unsignedBigInteger('appointment_id')->nullable();
            $table->integer('volume_ml');
            $table->decimal('weight')->nullable();
            $table->date('donation_date_time');
            $table->enum('screening_status', ['not_screened','passed', 'failed'])->default('not_screened');
            $table->text('notes')->nullable();
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
        Schema::dropIfExists('donations');
    }
};


