<?php

namespace App\Contracts;
use Carbon\Carbon;
interface NewsAdapter {
    /** @return \Generator<\App\DTO\NormalizedArticle> */
    public function fetchSince(Carbon $since): \Generator;
    public function key(): string;
}

namespace App\DTO;
use Carbon\Carbon;
final class NormalizedArticle {
    public function __construct(
        public string $sourceKey,
        public ?string $externalId,
        public string $url,
        public string $title,
        public ?string $excerpt,
        public ?string $contentText,
        public ?string $imageUrl,
        public ?string $language,
        public ?string $categoryKey,
        public array $authors,
        public ?Carbon $publishedAt,
    ) {}
}