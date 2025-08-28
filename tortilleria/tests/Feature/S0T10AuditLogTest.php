<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class S0T10AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_audit_log_is_created(): void
    {
        $this->post('/ventas', [
            'producto_id' => 1,
            'cantidad' => 1,
        ])->assertNoContent();

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'venta_creada',
        ]);
    }
}
