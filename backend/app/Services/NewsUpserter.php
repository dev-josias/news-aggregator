<?php

namespace App\Services;
use App\DTO\NormalizedArticle;
use App\Models\{Article, Author, Category, Source};
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

final class NewsUpserter
{

    private function uniqueSlug(string $base, int $sourceId): string {
        $slug = $base !== '' ? $base : 'article-'.substr(md5((string) microtime(true)), 0, 6);
        $try = $slug; $i = 2;


        while (Article::where('slug', $try)->exists()) {
            $try = Str::limit($slug, 76, '') . '-' . $i;
            $i++;
            if ($i > 50) { 
                $try = $slug . '-' . substr(md5($slug.$i), 0, 6);
                break;
            }
        }
        return $try;
    }
    public function upsert(NormalizedArticle $dto): ?Article
    {
        if (blank($dto->title) || blank($dto->url)) {
            Log::warning('Skipping article without required fields', [
                'source' => $dto->sourceKey,
                'externalId' => $dto->externalId,
                'url' => $dto->url,
                'title' => $dto->title,
            ]);
            return null;
        }

        $source = Source::firstOrCreate(['key' => $dto->sourceKey], ['name' => ucfirst($dto->sourceKey)]);

        $categoryId = null;
        if ($dto->categoryKey) {
            $catKey = Str::slug($dto->categoryKey);
            $category = Category::firstOrCreate(['key' => $catKey], [
                'name' => $dto->categoryKey,
                'external_id' => $dto->categoryKey,
            ]);
            $categoryId = $category->id;
        }

        $baseSlug = Str::slug(Str::limit($dto->title ?? '', 80));
        $slug = $this->uniqueSlug($baseSlug, $source->id);

        $payload = [
            'title'        => $dto->title ?: 'Untitled Article',
            'slug'         => $slug,
            'excerpt'      => $dto->excerpt,
            'content_text' => $dto->contentText,
            'url'          => $dto->url,
            'image_url'    => $dto->imageUrl,
            'language'     => $dto->language,
            'category_id'  => $categoryId,
            'source_id'    => $source->id,
            'published_at' => $dto->publishedAt,
            'ingested_at'  => now(),
        ];

        $match = $dto->externalId
            ? ['source_id' => $source->id, 'external_id' => $dto->externalId]
            : ['source_id' => $source->id, 'url' => $dto->url];

        $article = Article::updateOrCreate($match, $payload);

        if (method_exists($article, 'authors')) {
            $ids = collect($dto->authors)->filter()->take(5)->map(function (string $name) {
                $slug = Str::slug($name);
                return Author::firstOrCreate(['slug' => $slug], ['name' => $name])->id;
            })->all();
            $article->authors()->sync($ids);
        } elseif (!empty($dto->authors)) {
            $slug = Str::slug($dto->authors[0]);
            $author = Author::firstOrCreate(['slug' => $slug], ['name' => $dto->authors[0]]);
            if ($article->author_id !== $author->id) {
                $article->author_id = $author->id;
                $article->save();
            }
        }

        return $article;
    }
}