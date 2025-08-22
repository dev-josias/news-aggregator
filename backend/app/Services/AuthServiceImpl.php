<?php 
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthServiceImpl implements \App\Contracts\AuthService {
    public function login(string $email, string $password): array {
        $user = User::where("email", strtolower($email))->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                "email" => "The provided credentials are not correct",
            ]);
        }

        $token = $user->createToken("api")->plainTextToken;

        return ["user" => $user, "token"=> $token];
    }

    public function register(array $data): array {
        $user = User::create([
            "email" => $data["email"],
            "password" => Hash::make($data["password"]),
        ]);

        $token = $user->createToken("api")->plainTextToken;

        return ["user"=> $user,"token"=> $token];
    }

    public function logout(User $user, bool $allDevices = false): void {
        if($allDevices) {
            $user->tokens()->delete();
        } else {
            $token = $user->currentAccessToken();
            if ($token instanceof PersonalAccessToken) {
                $token->delete();
            }
        }
    }

    public function me(User $user): User {
        return $user;
    }
}