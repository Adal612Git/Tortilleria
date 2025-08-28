<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Datos de ejemplo para el esquema principal
        $productoId = DB::table('productos')->insertGetId([
            'nombre' => 'Tortilla de maiz',
            'precio' => 12.50,
            'stock' => 100,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $cajaId = DB::table('cajas')->insertGetId([
            'nombre' => 'Caja principal',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $ventaId = DB::table('ventas')->insertGetId([
            'caja_id' => $cajaId,
            'fecha' => now(),
            'total' => 25.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('kardex')->insert([
            'producto_id' => $productoId,
            'fecha' => now(),
            'tipo' => 'entrada',
            'cantidad' => 100,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('detalles_venta')->insert([
            'venta_id' => $ventaId,
            'producto_id' => $productoId,
            'cantidad' => 2,
            'precio' => 12.50,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
