<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\AuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(LoginRequest $request, AuthService $auth) {
        $data = $request->validated();
        ['user' => $user, 'token' => $token] = $auth
        ->login(
            $data['email'], 
            $data['password']
        );
        return (new UserResource($user))->additional(['token' => $token]);
    }

    public function register(RegisterRequest $request, AuthService $auth) {
        ['user' => $user, 'token' => $token] = $auth->register($request->validated());
        return (new UserResource($user))->additional(['token' => $token]);
    }

    public function logout(Request $request, AuthService $auth) {
        $auth->logout($request->user(), (bool) $request->boolean('allDevices'));
        return response()->noContent();
    }

    public function me(Request $request, AuthService $auth) { 
        return new UserResource($auth->me($request->user()));
    }
}
