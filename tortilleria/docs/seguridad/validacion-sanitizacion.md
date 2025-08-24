# Validación y Sanitización

## Principios
- Validar **todo input** antes de persistir.
- Sanitizar strings (trim/escape) y normalizar números/fechas.
- Mensajes claros y consistentes (por rol/flujo).

## Reglas por módulo (ejemplos)
- **Inventario:** cantidades > 0, costos ≥ 0, FK existentes.
- **POS:** stock suficiente, descuentos válidos, totales ≈ sumas de líneas.
- **Cajas:** apertura/cierre en orden; arqueo cuadrado (tolerancia definida).
- **Reparto:** tienda válida, evidencia opcional offline.

## Errores
- Responder 422 con detalle campo→regla; no exponer stack.
- Bitácora de intentos inválidos en auditoría (nivel info).
