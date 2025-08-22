<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title','slug','excerpt','content_text','url','image_url',
        'language','category_id','source_id','published_at','ingested_at','external_id'
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    protected static function booted() {
            static::creating(function ($article) {
            if (empty($article->slug)) {
                $base = Str::limit(Str::slug($article->title ?: 'article'), 80, '');
                $suffix = substr(md5($article->url), 0, 6);
                $article->slug = $base . '-' . $suffix;
            }
        });
    }

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
