<?php

namespace App\Providers;

use App\Contracts\AuthService;
use App\Contracts\PreferencesRepository;
use App\News\Adapters\GuardianAdapter;
use App\News\Adapters\NewsApiAdapter;
use App\News\Adapters\NytAdapter;
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
        $this->app->bind('news.adapter.guardian', fn($app) => $app->make(GuardianAdapter::class));
        $this->app->bind('news.adapter.newsapi',  fn($app) => $app->make(NewsApiAdapter::class));
        $this->app->bind('news.adapter.nyt',      fn($app) => $app->make(NytAdapter::class));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
