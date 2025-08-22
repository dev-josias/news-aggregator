<?php

use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\FeedController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\PreferencesController;
use App\Http\Controllers\Api\V1\TaxonomyController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login',    [AuthController::class, 'login']);

    Route::get('/health', HealthController::class);
    Route::get('/sources', [TaxonomyController::class, 'sources']);
    Route::get('/categories', [TaxonomyController::class, 'categories']);
    Route::get('/authors', [TaxonomyController::class, 'authors']);
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{article}', [ArticleController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/me/preferences', [PreferencesController::class, 'show']);
        Route::put('/me/preferences', [PreferencesController::class, 'update']);
        Route::get('/me/feed', FeedController::class);
    });
});