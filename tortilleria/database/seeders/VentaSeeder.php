<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VentaSeeder extends Seeder
{
    public function run(): void
    {
        $cajaId = DB::table('cajas')->first()->id;

        DB::table('ventas')->insert([
            'caja_id' => $cajaId,
            'fecha' => now(),
            'total' => 100.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
