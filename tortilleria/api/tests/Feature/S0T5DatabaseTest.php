<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class S0T5DatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_tablas_principales_existen(): void
    {
        $this->assertTrue(Schema::hasTable('productos'));
        $this->assertTrue(Schema::hasTable('kardex'));
        $this->assertTrue(Schema::hasTable('ventas'));
        $this->assertTrue(Schema::hasTable('cajas'));
        $this->assertTrue(Schema::hasTable('detalles_venta'));
    }
}
