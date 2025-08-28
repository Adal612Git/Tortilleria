<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\TestCase;

class S0T5DatabaseTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $app = require __DIR__ . '/../../tortilleria/bootstrap/app.php';
        $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    }

    protected function tearDown(): void
    {
        restore_error_handler();
        restore_exception_handler();
        parent::tearDown();
    }

    public function test_migrations_and_seeders_run_and_insert_dummy_data(): void
    {
        Artisan::call('migrate:fresh');
        Artisan::call('db:seed');

        $tables = ['productos', 'kardex', 'ventas', 'cajas', 'detalles_venta'];

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table));
            $this->assertGreaterThan(0, DB::table($table)->count());
        }
    }
}
