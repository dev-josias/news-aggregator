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
        'category_id'
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
}
