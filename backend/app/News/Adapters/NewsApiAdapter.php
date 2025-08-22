<?php

namespace App\News\Adapters;
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
        $base = rtrim((string) config('news.newsapi.base_url', 'https://newsapi.org/v2'), '/');
        $key  = config('news.newsapi.key');
        $lang = (string) config('news.newsapi.language', 'en');
        $size = (int) config('news.newsapi.page_size', 100);
        $q    = (string) config('news.newsapi.query', 'techcrunch+bbc-news+engadget');

        if (blank($key)) {
            info('NewsAPI skipped: missing API key');
            return;
        }

        for ($page = 1; $page <= 5; $page++) {
            $resp = $this->http
                ->retry(2, 800)
                ->timeout(10)
                ->get("$base/everything", [
                    'apiKey'   => $key,
                    'q'        => $q,                 // e.g. 'apple'
                    'from'     => $since->toDateString(),     // YYYY-MM-DD
                    'to'       => now()->toDateString(),      // YYYY-MM-DD
                    'sortBy'   => 'publishedAt',
                    'language' => $lang,
                    'pageSize' => min($size, 100),
                    'page'     => $page,
                ])
                ->throw()
                ->json();

            $items = data_get($resp, 'articles', []);
            if (empty($items)) break;

            $stop = false;
            foreach ($items as $it) {
                $publishedAt = $it['publishedAt'] ?? null;
                if (!$publishedAt) {
                    continue;
                }
                $published = Carbon::parse($publishedAt);

                if ($published->lt($since)) { continue; }

                yield new NormalizedArticle(
                    sourceKey:   'newsapi',
                    externalId:  null,
                    url:         (string) ($it['url'] ?? ''),
                    title:       (string) ($it['title'] ?? ''),
                    excerpt:     $it['description'] ?? null,
                    contentText: $it['content'] ?? null,
                    imageUrl:    $it['urlToImage'] ?? null,
                    language:    $lang,
                    categoryKey: null,
                    authors:     array_filter([(string) ($it['author'] ?? '')]),
                    publishedAt: $published,
                );
            }

            if ($stop) break;
        }
    }
}