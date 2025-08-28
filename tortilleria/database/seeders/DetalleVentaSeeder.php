<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DetalleVentaSeeder extends Seeder
{
    public function run(): void
    {
        $ventaId = DB::table('ventas')->first()->id;
        $productoId = DB::table('productos')->first()->id;

        DB::table('detalles_venta')->insert([
            'venta_id' => $ventaId,
            'producto_id' => $productoId,
            'cantidad' => 10,
            'precio' => 10.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
