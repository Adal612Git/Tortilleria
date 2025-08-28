<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VentaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('cliente')) {
            $this->merge([
                'cliente' => e(trim($this->input('cliente'))),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'cliente' => 'required|string|min:3|max:255',
            'producto_id' => 'required|integer|min:1',
            'cantidad' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
            'fecha' => 'required|date_format:Y-m-d',
        ];
    }

    public function messages(): array
    {
        return [
            'cliente.required' => 'El nombre del cliente es obligatorio.',
            'cliente.string' => 'El nombre del cliente debe ser texto.',
            'cliente.min' => 'El nombre del cliente debe tener al menos 3 caracteres.',
            'cliente.max' => 'El nombre del cliente no puede superar los 255 caracteres.',
            'producto_id.required' => 'El producto es obligatorio.',
            'producto_id.integer' => 'El producto debe ser un identificador válido.',
            'producto_id.min' => 'El producto debe ser un identificador válido.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'total.required' => 'El total es obligatorio.',
            'total.numeric' => 'El total debe ser un número.',
            'total.min' => 'El total no puede ser negativo.',
            'fecha.required' => 'La fecha es obligatoria.',
            'fecha.date_format' => 'La fecha debe tener el formato YYYY-MM-DD.',
        ];
    }
}
