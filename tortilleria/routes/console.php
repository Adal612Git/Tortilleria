<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('audit:prune', function () {
    $days = (int) config('audit.retention_days');
    DB::table('audit_logs')
        ->where('created_at', '<', now()->subDays($days))
        ->delete();
})->purpose('Prune old audit logs');
