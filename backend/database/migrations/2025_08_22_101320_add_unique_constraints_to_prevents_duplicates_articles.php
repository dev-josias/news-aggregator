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
            $table->unique(
                ['source_id', 'external_id'],
                'ux_articles_source_external'
            );

            $table->unique(
                ['source_id', 'url'],
                'ux_articles_source_url'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropUnique('ux_articles_source_external');
            $table->dropUnique('ux_articles_source_url');
        });
    }
};
