<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule XP reset every Sunday at midnight
Schedule::command('xp:reset-weekly')
    ->weekly()
    ->sundays()
    ->at('00:00')
    ->timezone('Europe/Brussels'); // Adjust to your timezone
