<?php

namespace App\Providers;

use App\Contracts\AuthService;
use App\Contracts\PreferencesRepository;
use App\Repositories\PreferencesRepositoryImpl;
use App\Services\AuthServiceImpl;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthService::class, AuthServiceImpl::class);
        $this->app->bind(PreferencesRepository::class, PreferencesRepositoryImpl::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
