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
            if (!Schema::hasColumn('articles', 'content_text')) {
                $table->longText('content_text')->nullable();
            }
            if (!Schema::hasColumn('articles', 'language')) {
                $table->string('language', 8)->nullable()->index();
            }
            $table->string('title', 512)->change();
            $table->string('slug', 191)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            //
        });
    }
};
