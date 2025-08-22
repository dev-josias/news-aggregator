<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'key',
        'slug',
        'url',
        'external_id',
        'source_id',
        'author_id',
        'category_id',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo {
        return $this->belongsTo(Author::class);
    }

    public function source(): BelongsTo {
        return $this->belongsTo(Source::class);
    }

    public function scopeBySource($q, $id){
        return $id ? $q->where('source_id', $id) : $q;
    }

    public function scopeByCategory($q, $id){
        return $id ? $q->where('category_id', $id) : $q;
    }

    public function scopeByAuthor($q, $id){
        return $id ? $q->where('author_id', $id) : $q;
    }

    public function scopeDateRange($query, $from = null, $to = null) {
        if ($from) {
            $query->where('published_at', '>=', $from);
        }
        if ($to) {
            $query->where('published_at', '<=', $to);
        }
        return $query;
    }

    public function scopeSortByPublished($query, $direction = 'desc') {
        return $query->orderBy('published_at', $direction);
    }

    public function scopeSearch($query, ?string $q) {
        if ($q) {
            $query->whereRaw("search_vector @@ plainto_tsquery('simple', ?)", [$q])
                ->orderByRaw("ts_rank(search_vector, plainto_tsquery('simple', ?)) DESC", [$q]);
        }
        return $query;
    }
}
