<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::factory()->count(10)->create();
        $authors    = Author::factory()->count(20)->create();
        $sources    = Source::factory()->count(3)->create();
        Article::factory()
        ->count(100)
        ->recycle([$categories, $authors, $sources])
        ->for(Category::factory())
        ->for(Source::factory())
        ->for(Author::factory())
        ->create();
    }
}
