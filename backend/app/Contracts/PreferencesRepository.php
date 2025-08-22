<?php
namespace App\Contracts;

interface PreferencesRepository
{
    public function get(int $userId): array;
    public function sync(int $userId, array $sources, array $categories, array $authors): void;
    public function asFilters(int $userId): array;
}