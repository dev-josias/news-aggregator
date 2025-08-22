<?php 

namespace App\Repositories;

use App\Models\Author;
use App\Models\Category;
use App\Models\Source;

class TaxonomyRepository {
    public function sources() {
        return Source::query()->orderBy('name')->get();
    }

    public function categories() {
        return Category::query()->orderBy('name')->get();
    }

    public function authors() {
        return Author::query()->orderBy('name')->get();
    }
}