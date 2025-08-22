<?php
namespace App\Contracts;

use App\Models\User;

interface AuthService {
    public function register(array $data): array;

    public function login(string $email, string $password): array;

    public function logout(User $user, bool $allDevices): void;

    public function me(User $user): User;
}