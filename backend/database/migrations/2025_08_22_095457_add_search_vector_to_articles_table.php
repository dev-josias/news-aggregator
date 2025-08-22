<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->longText("content_text")->nullable();
        });

        DB::statement("ALTER TABLE articles ADD COLUMN search_vector tsvector");
        DB::statement("CREATE INDEX articles_search_gin ON articles USING GIN (search_vector)");

        DB::statement("
            CREATE FUNCTION articles_search_vector_update() RETURNS trigger AS $$
            BEGIN
              NEW.search_vector :=
                setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A') ||
                setweight(to_tsvector('simple', coalesce(NEW.excerpt, '')), 'B') ||
                setweight(to_tsvector('simple', coalesce(NEW.content_text, '')), 'C');
              RETURN NEW;
            END
            $$ LANGUAGE plpgsql;
        ");

        DB::statement("
            CREATE TRIGGER articles_search_vector_trigger
            BEFORE INSERT OR UPDATE ON articles
            FOR EACH ROW EXECUTE FUNCTION articles_search_vector_update();
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS articles_search_vector_trigger ON articles');
        DB::statement('DROP FUNCTION IF EXISTS articles_search_vector_update');
        DB::statement('DROP INDEX IF EXISTS articles_search_gin');
        Schema::table('articles', function (Blueprint $table) {
            //
        });
    }
};
