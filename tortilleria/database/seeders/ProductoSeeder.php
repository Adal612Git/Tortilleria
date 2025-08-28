<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('productos')->insert([
            'nombre' => 'Tortilla de maiz',
            'precio' => 10.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
