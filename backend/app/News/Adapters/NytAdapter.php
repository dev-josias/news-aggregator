<?php

namespace App\News\Adapters;
use App\Contracts\NewsAdapter;
use App\DTO\NormalizedArticle;
use Carbon\Carbon;
use Illuminate\Http\Client\Factory as Http;

final class NytAdapter implements NewsAdapter
{
    public function __construct(private Http $http) {}

    public function key(): string { return 'nyt'; }

    public function fetchSince(Carbon $since): \Generator
    {
        $base = rtrim(config('news.nyt.base_url'), '/');
        $key  = config('news.nyt.key');
        $size = (int) config('news.nyt.page_size', 10);

        for ($page = 0; $page <= 50; $page++) {
            $resp = $this->http->retry(2, 800)->timeout(10)->get("$base/search/v2/articlesearch.json", [
                'api-key'    => $key,
                'sort'       => 'newest',
                'begin_date' => $since->format('Ymd'),
                'page'       => $page,
            ])->throw()->json();

            $docs = data_get($resp, 'response.docs', []);
            if (!$docs) break;

            foreach ($docs as $doc) {
                $published = Carbon::parse($doc['pub_date'] ?? null);
                if ($published && $published->lt($since)) break 2;

                $authors = collect(data_get($doc, 'byline.person', []))
                    ->map(fn($p) => trim(($p['firstname'] ?? '').' '.($p['lastname'] ?? '')))
                    ->filter()->values()->all();
                if (empty($authors) && ($orig = data_get($doc, 'byline.original'))) {
                    $authors = collect(preg_split('/\sand\s/i', preg_replace('/^By\s+/i', '', $orig)))->map('trim')->filter()->all();
                }

                $image = null;
                foreach ((array) data_get($doc, 'multimedia', []) as $m) {
                    if (!empty($m['url'])) { $image = 'https://www.nytimes.com/'.$m['url']; break; }
                }

                $title = (string) (
                    data_get($doc, 'headline.main')
                    ?? data_get($doc, 'headline.print_headline')
                    ?? data_get($doc, 'snippet')
                    ?? ''
                );

                if (empty($title) || empty($doc['web_url'])) {
                    continue;
                }

                yield new NormalizedArticle(
                    sourceKey:  'nyt',
                    externalId: $doc['_id'] ?? ($doc['uri'] ?? null),
                    url:        (string) $doc['web_url'],
                    title:      $title,
                    excerpt:    data_get($doc, 'abstract') ?? data_get($doc, 'lead_paragraph'),
                    contentText:null,
                    imageUrl:   $image,
                    language:   'en',
                    categoryKey:data_get($doc, 'section_name') ?? data_get($doc, 'news_desk'),
                    authors:    $authors,
                    publishedAt:$published,
                );
            }
        }
    }
}