<?php

namespace App\Infrastructure\News\Adapters;
use App\Contracts\NewsAdapter;
use App\DTO\NormalizedArticle;
use Carbon\Carbon;
use Illuminate\Http\Client\Factory as Http;

final class NewsApiAdapter implements NewsAdapter
{
    public function __construct(private Http $http) {}

    public function key(): string { return 'newsapi'; }

    public function fetchSince(Carbon $since): \Generator
    {
        $base = config('news.newsapi.base_url');
        $key  = config('news.newsapi.key');
        $lang = config('news.newsapi.language', 'en');
        $size = (int) config('news.newsapi.page_size', 100);

        for ($page = 1; $page <= 20; $page++) {
            $resp = $this->http->retry(2, 800)->timeout(10)->get("$base/everything", [
                'apiKey'   => $key,
                'from'     => $since->toIso8601String(),
                'language' => $lang,
                'sortBy'   => 'publishedAt',
                'pageSize' => $size,
                'page'     => $page,
            ])->throw()->json();

            $items = data_get($resp, 'articles', []);
            if (!$items) break;

            foreach ($items as $it) {
                $published = Carbon::parse($it['publishedAt'] ?? null);
                if ($published && $published->lt($since)) break 2;

                yield new NormalizedArticle(
                    sourceKey:  'newsapi',
                    externalId: null,
                    url:        (string) $it['url'],
                    title:      (string) $it['title'],
                    excerpt:    $it['description'] ?? null,
                    contentText:$it['content'] ?? null,
                    imageUrl:   $it['urlToImage'] ?? null,
                    language:   $lang,
                    categoryKey:null,
                    authors:    array_filter([(string) ($it['author'] ?? '')]),
                    publishedAt:$published,
                );
            }
        }
    }
}