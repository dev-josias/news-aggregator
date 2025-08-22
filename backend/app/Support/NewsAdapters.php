<?php

namespace App\Support;

use App\Contracts\NewsAdapter;

final class NewsAdapters
{
    /** @return NewsAdapter[] */
    public static function all(): array
    {
        return collect(config('news.adapters', []))->map(function ($key) {
            return app('news.adapter.'.$key);
        })->all();
    }
}