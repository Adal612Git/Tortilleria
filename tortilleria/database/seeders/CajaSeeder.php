<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CajaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cajas')->insert([
            'nombre' => 'Caja Principal',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
