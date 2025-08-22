<?php

namespace App\News\Adapters;
use App\Contracts\NewsAdapter;
use App\DTO\NormalizedArticle;
use Carbon\Carbon;
use Illuminate\Http\Client\Factory as Http;

final class GuardianAdapter implements NewsAdapter
{
    public function __construct(private Http $http) {}

    public function key(): string { return 'guardian'; }

    public function fetchSince(Carbon $since): \Generator
    {
        $base = config('news.guardian.base_url');
        $key  = config('news.guardian.key');
        $page = 1;
        $size = (int) config('news.guardian.page_size', 50);

        while (true) {
            $resp = $this->http->retry(2, 800)->timeout(10)->get("$base/search", [
                'api-key'     => $key,
                'show-fields' => 'trailText,bodyText,thumbnail',
                'show-tags'   => 'contributor',
                'page'        => $page,
                'page-size'   => $size,
                'from-date'   => $since->toDateString(),
                'order-by'    => 'newest',
            ])->throw()->json();

            $items = data_get($resp, 'response.results', []);
            if (!$items) break;

            foreach ($items as $it) {
                $published = Carbon::parse($it['webPublicationDate'] ?? null);
                if ($published && $published->lt($since)) break 2;

                $authors = collect(data_get($it, 'tags', []))
                    ->pluck('webTitle')->filter()->values()->all();
                    
                if (empty($it['webTitle']) || empty($it['webUrl'])) {
                    continue;
                }

                yield new NormalizedArticle(
                    sourceKey:  'guardian',
                    externalId: $it['id'] ?? null,
                    url:        $it['webUrl'],
                    title:      $it['webTitle'],
                    excerpt:    data_get($it, 'fields.trailText'),
                    contentText:data_get($it, 'fields.bodyText'),
                    imageUrl:   data_get($it, 'fields.thumbnail'),
                    language:   'en',
                    categoryKey:$it['sectionId'] ?? null,
                    authors:    $authors,
                    publishedAt:$published,
                );
            }

            $page++;
            if ($page > (int) data_get($resp, 'response.pages', 1)) break;
        }
    }
}