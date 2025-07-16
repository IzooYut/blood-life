<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Schema\Blueprint;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Blueprint::macro('trackCreatedBy', function () {
            $this->foreignId('added_by')->nullable()->constrained('users')->nullOnDelete();
        });

        Blueprint::macro('trackUpdatedBy', function () {
            $this->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
        });

        Blueprint::macro('trackDeletedBy', function () {
            $this->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete();
        });

        Blueprint::macro('trackUserActions', function () {
            $this->trackCreatedBy();
            $this->trackUpdatedBy();
            $this->trackDeletedBy();
        });
    }
}
