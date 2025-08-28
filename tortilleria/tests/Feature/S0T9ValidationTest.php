<?php

namespace Tests\Feature;

use App\Http\Requests\ProductoRequest;
use App\Http\Requests\VentaRequest;
use App\Http\Requests\CajaRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class S0T9ValidationTest extends TestCase
{
    public function test_producto_request_accepts_valid_data(): void
    {
        $request = new ProductoRequest();
        $validator = Validator::make([
            'nombre' => 'Tortilla',
            'descripcion' => 'Maíz',
            'precio' => 10.5,
            'stock' => 5,
        ], $request->rules(), $request->messages());

        $this->assertTrue($validator->passes());
    }

    public function test_producto_request_rejects_invalid_data(): void
    {
        $request = new ProductoRequest();
        $validator = Validator::make([
            'nombre' => '',
            'precio' => -1,
            'stock' => -5,
        ], $request->rules(), $request->messages());

        $this->assertTrue($validator->fails());
    }

    public function test_venta_request_accepts_valid_data(): void
    {
        $request = new VentaRequest();
        $validator = Validator::make([
            'cliente' => 'Juan',
            'producto_id' => 1,
            'cantidad' => 2,
            'total' => 20.0,
            'fecha' => '2024-01-01',
        ], $request->rules(), $request->messages());

        $this->assertTrue($validator->passes());
    }

    public function test_venta_request_rejects_invalid_data(): void
    {
        $request = new VentaRequest();
        $validator = Validator::make([
            'cliente' => 'J',
            'producto_id' => 0,
            'cantidad' => 0,
            'total' => -1,
            'fecha' => '01-01-2024',
        ], $request->rules(), $request->messages());

        $this->assertTrue($validator->fails());
    }

    public function test_caja_request_accepts_valid_data(): void
    {
        $request = new CajaRequest();
        $validator = Validator::make([
            'concepto' => 'Apertura',
            'monto' => 100.0,
            'fecha' => '2024-01-01',
        ], $request->rules(), $request->messages());

        $this->assertTrue($validator->passes());
    }

    public function test_caja_request_rejects_invalid_data(): void
    {
        $request = new CajaRequest();
        $validator = Validator::make([
            'concepto' => '',
            'monto' => -50,
            'fecha' => '01/01/2024',
        ], $request->rules(), $request->messages());

        $this->assertTrue($validator->fails());
    }
}
