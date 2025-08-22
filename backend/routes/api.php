<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['prefix' => '/api/v1'], function() {
    Route::get('/health', '');
    Route::get('/sources', '');
    Route::get('categories', '');
    Route::get('/authors', '');

    Route::group(['prefix'=> '/articles'], function() {
        Route::get('/', '');
        Route::get('/{id}', '');
    });

    Route::group(['prefix'=> '/auth'], function() {
        Route::post('/login', '');
        Route::post('/register', '');
        Route::post('/logout', '')->middleware('auth:sanctum');
    });

    Route::group(['prefix'=> '/me'], function() {
        Route::get('/', '');
        Route::get('/feed', '');
        Route::get('/preferences', '');
    })->middleware('auth:sanctum');
});