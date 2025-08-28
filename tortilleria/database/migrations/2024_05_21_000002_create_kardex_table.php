<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kardex', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos');
            $table->date('fecha')->index();
            $table->string('movimiento');
            $table->integer('cantidad');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kardex');
    }
};
