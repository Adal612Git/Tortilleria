<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/ventas', function (Request $request) {
    return response()->noContent();
})->middleware('audit:venta_creada');
