<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'excerpt'))     $table->text('excerpt')->nullable();
            if (!Schema::hasColumn('articles', 'image_url'))   $table->string('image_url')->nullable();
            if (!Schema::hasColumn('articles', 'language'))    $table->string('language', 10)->nullable();
            if (!Schema::hasColumn('articles', 'ingested_at')) $table->timestamp('ingested_at')->nullable()->index();


            $table->dropConstrainedForeignId('category_id');
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();

            $table->dropUnique('articles_url_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
