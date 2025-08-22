<?php

namespace App\Services;

use App\Contracts\PreferencesRepository;
use Illuminate\Validation\ValidationException;

class PreferencesService
{
    public function __construct(private PreferencesRepository $repo) {}

    public function get(int $userId): array
    {
        return $this->repo->get($userId);
    }

    public function update(int $userId, array $data): void
    {
        foreach (['sources','categories','authors'] as $k) {
            if (isset($data[$k]) && count($data[$k]) > 100) {
                throw ValidationException::withMessages([$k => ['Too many items (max 100).']]);
            }
        }

        $this->repo->sync(
            $userId,
            $data['sources']    ?? [],
            $data['categories'] ?? [],
            $data['authors']    ?? [],
        );
    }

    public function filtersForUser(int $userId): array
    {
        return $this->repo->asFilters($userId);
    }
}