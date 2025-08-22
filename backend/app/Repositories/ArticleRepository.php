<?php
namespace App\Repositories;

use App\Models\Article;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ArticleRepository
{
    public function list(array $filters): LengthAwarePaginator
    {
        $pageSize = min((int)($filters['pageSize'] ?? 20), 50);
        $q        = $filters['q'] ?? null;
        $sort     = $filters['sort'] ?? 'published_desc';

        $query = Article::query()
            ->select([
                'id','title','slug','url','image_url','excerpt',
                'source_id','category_id','author_id','published_at',
            ])
            ->with([
                'source:id,name',
                'category:id,name',
                'author:id,name',
            ])
            ->bySource($filters['source'] ?? null)
            ->byCategory($filters['category'] ?? null)
            ->byAuthor($filters['author'] ?? null)
            ->dateRange($filters['from'] ?? null, $filters['to'] ?? null)

            ->when(!empty($filters['source_in']),   fn($q) => $q->whereIn('source_id',   $filters['source_in']))
            ->when(!empty($filters['category_in']), fn($q) => $q->whereIn('category_id', $filters['category_in']))
            ->when(!empty($filters['author_in']),   fn($q) => $q->whereIn('author_id',   $filters['author_in']))
            ->search($q);

        if ($q) {
            $query->orderByRaw("
                ts_rank(search_vector, plainto_tsquery('english', ?)) DESC,
                published_at DESC
            ", [$q]);
        } else {
            $dir = $sort === 'published_asc' ? 'asc' : 'desc';
            $query->orderBy('published_at', $dir)->orderBy('id', 'desc');
        }

        return $query->paginate($pageSize);
    }
}
