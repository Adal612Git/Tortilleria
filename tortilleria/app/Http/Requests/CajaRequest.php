<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CajaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('concepto')) {
            $this->merge([
                'concepto' => e(trim($this->input('concepto'))),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'concepto' => 'required|string|min:3|max:255',
            'monto' => 'required|numeric|min:0',
            'fecha' => 'required|date_format:Y-m-d',
        ];
    }

    public function messages(): array
    {
        return [
            'concepto.required' => 'El concepto es obligatorio.',
            'concepto.string' => 'El concepto debe ser texto.',
            'concepto.min' => 'El concepto debe tener al menos 3 caracteres.',
            'concepto.max' => 'El concepto no puede superar los 255 caracteres.',
            'monto.required' => 'El monto es obligatorio.',
            'monto.numeric' => 'El monto debe ser un número.',
            'monto.min' => 'El monto no puede ser negativo.',
            'fecha.required' => 'La fecha es obligatoria.',
            'fecha.date_format' => 'La fecha debe tener el formato YYYY-MM-DD.',
        ];
    }
}
