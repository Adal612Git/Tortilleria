<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalles_venta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venta_id')->constrained('ventas')->index();
            $table->foreignId('producto_id')->constrained('productos');
            $table->integer('cantidad');
            $table->decimal('precio', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalles_venta');
    }
};
