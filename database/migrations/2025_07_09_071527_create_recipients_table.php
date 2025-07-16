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
        Schema::create('recipients', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('id_number')->nullable()->unique();
            $table->unsignedBigInteger('blood_group_id')->index();
            $table->unsignedBigInteger('hospital_id')->index();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable()->index();
            $table->text('medical_notes')->nullable();
            $table->trackUserActions();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipients');
    }
};
