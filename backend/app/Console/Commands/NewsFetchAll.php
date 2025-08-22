<?php

namespace App\Console\Commands;

use App\Models\{IngestionRun, Source};
use App\Services\NewsUpserter;
use App\Support\NewsAdapters;
use Carbon\Carbon;
use Illuminate\Console\Command;

class NewsFetchAll extends Command
{
    protected $signature = 'news:fetch-all {--since=-6 hours}';
    protected $description = 'Fetch news from configured adapters since a time';

    public function handle(NewsUpserter $upserter)
    {
        $since = Carbon::parse($this->option('since'));

        foreach (NewsAdapters::all() as $adapter) {
            $this->info("Fetching: ".$adapter->key()." since ".$since->toIso8601String());

            $source = Source::firstOrCreate(['key' => $adapter->key()], ['name' => ucfirst($adapter->key())]);
            $run = IngestionRun::create([
                'source_id'  => $source->id,
                'started_at' => now(),
                'status'     => 'running',
            ]);

            $count = 0;
            try {
                foreach ($adapter->fetchSince($since) as $dto) {
                    $upserter->upsert($dto);
                    $count++;
                }
                $run->update(['fetched_count' => $count, 'finished_at' => now(), 'status' => 'ok']);
                $this->info("Done: {$adapter->key()} fetched {$count}");
            } catch (\Throwable $e) {
                $run->update([
                    'fetched_count' => $count,
                    'finished_at'   => now(),
                    'status'        => 'error',
                    'error_text'    => substr((string) $e, 0, 1000),
                ]);
                $this->error("Error in {$adapter->key()}: ".$e->getMessage());
                report($e);
            }
        }

        return self::SUCCESS;
    }
}