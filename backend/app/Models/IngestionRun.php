<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IngestionRun extends Model {
    protected $fillable = [
        'source_id',
        'started_at',
        'finished_at',
        'fetched_count',
        'status',
        'error_text'
    ];
    public function source(){ return $this->belongsTo(Source::class); }
}