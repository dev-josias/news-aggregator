<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


$cmd = 'news:fetch-all --since="-6 hours"';

if (App::environment('local')) {
    Schedule::command($cmd)->everyThreeMinutes()->withoutOverlapping();
} else {
    Schedule::command($cmd)->hourly()->withoutOverlapping();
}
