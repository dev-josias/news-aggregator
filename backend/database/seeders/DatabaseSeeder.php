<?php

namespace Database\Seeders;

use App\Models\Category;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            SourceSeeder::class,
            AuthorSeeder::class,
            CategorySeeder::class,
            ArticleSeeder::class,
        ]);
    }
}
