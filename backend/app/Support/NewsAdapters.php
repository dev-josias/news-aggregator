<?php

namespace App\Support;

use App\Contracts\NewsAdapter;
use App\Models\Source;

final class NewsAdapters
{
    /** @return NewsAdapter[] */
    public static function all(): array
    {
        return collect(config('news.adapters', []))
            ->map(fn ($key) => self::resolve($key))
            ->filter()
            ->all();
    }

    public static function enabled(): array {
        $keys = Source::query()->where('enabled', true)->pluck('key')->all();

        if (empty($keys)) {
            $keys = config('news.adapters', []);
        }

        return collect($keys)
            ->map(fn ($key) => self::resolve($key))
            ->filter()
            ->all();
    }

    public static function only(array $keys): array {
        $known = collect(config('news.adapters', []));
        return collect($keys)
            ->filter(fn ($k) => $known->contains($k))
            ->map(fn ($k) => self::resolve($k))
            ->filter()
            ->all();
    }

    private static function resolve(string $key): ?NewsAdapter {
        $binding = 'news.adapter.'.$key;
        return app()->bound($binding) ? app($binding) : null;
    }
}