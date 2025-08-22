<?php
namespace App\Services;

use App\Contracts\PreferencesRepository;
use App\Repositories\ArticleRepository;

class FeedService {
    public function __construct(private ArticleRepository $repo, private PreferencesRepository $prefs) {}

    public function forUser(int $userId, int $pageSize)
    {
        $filters = $this->prefs->asFilters($userId);
        return $this->repo->list($filters + ['sort' => 'published_desc', 'pageSize' => $pageSize]);
    }
}