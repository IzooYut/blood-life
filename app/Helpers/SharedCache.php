<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use App\Models\Country;
use App\Models\ShippingRate;

class SharedCache
{
    public static function refreshDbCountries(): void
    {
        Cache::forget('db_countries');
        Cache::rememberForever('db_countries', fn () =>
            Country::orderBy('name')->get()
        );
    }

    public static function refreshFromCountries(): void
    {
        Cache::forget('from_countries');
        $fromIds = ShippingRate::distinct()->pluck('country')->filter()->unique();
        Cache::rememberForever('from_countries', fn () =>
            Country::whereIn('id', $fromIds)->orderBy('name')->get()
        );
    }

    public static function refreshToCountries(): void
    {
        Cache::forget('to_countries');
        $toIds = ShippingRate::distinct()->pluck('to_country')->filter()->unique();
        Cache::rememberForever('to_countries', fn () =>
            Country::whereIn('id', $toIds)->orderBy('name')->get()
        );
    }

    public static function refreshAll(): void
    {
        self::refreshDbCountries();
        self::refreshFromCountries();
        self::refreshToCountries();
    }
}
