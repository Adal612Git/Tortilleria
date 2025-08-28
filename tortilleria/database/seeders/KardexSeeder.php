<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KardexSeeder extends Seeder
{
    public function run(): void
    {
        $productoId = DB::table('productos')->first()->id;

        DB::table('kardex')->insert([
            'producto_id' => $productoId,
            'fecha' => now()->toDateString(),
            'movimiento' => 'entrada',
            'cantidad' => 100,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
