<?php
namespace App\Repositories;

use App\Contracts\PreferencesRepository;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PreferencesRepositoryImpl implements PreferencesRepository
{
    public function get(int $userId): array
    {
        $user = User::query()->findOrFail($userId);

        return [
            'sources'    => $user->preferredSources()->pluck('sources.id')->all(),
            'categories' => $user->preferredCategories()->pluck('categories.id')->all(),
            'authors'    => $user->preferredAuthors()->pluck('authors.id')->all(),
        ];
    }

    public function sync(int $userId, array $sources, array $categories, array $authors): void
    {
        $sources    = array_values(array_unique(array_map('intval', $sources)));
        $categories = array_values(array_unique(array_map('intval', $categories)));
        $authors    = array_values(array_unique(array_map('intval', $authors)));

        /** @var User $user */
        $user = User::query()->findOrFail($userId);

        DB::transaction(function () use ($user, $sources, $categories, $authors) {
            $user->preferredSources()->sync($sources);
            $user->preferredCategories()->sync($categories);
            $user->preferredAuthors()->sync($authors);
        });
    }

    public function asFilters(int $userId): array
    {
        $prefs = $this->get($userId);

        $filters = [];
        if (!empty($prefs['sources']))    $filters['source_in']    = $prefs['sources'];
        if (!empty($prefs['categories'])) $filters['category_in']  = $prefs['categories'];
        if (!empty($prefs['authors']))    $filters['author_in']    = $prefs['authors'];


        $filters['sort'] = 'published_desc';

        return $filters;
    }
}