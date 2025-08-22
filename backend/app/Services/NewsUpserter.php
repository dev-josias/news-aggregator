<?php

namespace App\Services;
use App\DTO\NormalizedArticle;
use App\Models\{Article, Author, Category, Source};
use Illuminate\Support\Str;

final class NewsUpserter
{
    public function upsert(NormalizedArticle $dto): Article
    {
        $source = Source::firstOrCreate(['key' => $dto->sourceKey], ['name' => ucfirst($dto->sourceKey)]);

        $categoryId = null;
        if ($dto->categoryKey) {
            $category = Category::firstOrCreate(['key' => $dto->categoryKey], ['name' => ucfirst($dto->categoryKey)]);
            $categoryId = $category->id;
        }

        $payload = [
            'title'        => $dto->title,
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