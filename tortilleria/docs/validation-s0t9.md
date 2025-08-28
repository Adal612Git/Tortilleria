# Validaciones S0T9

## ProductoRequest
- **nombre**: requerido, texto 3-255 caracteres, trim y escape.
- **descripcion**: opcional, texto hasta 500 caracteres, trim y escape.
- **precio**: requerido, numérico, rango 0-999999.99.
- **stock**: requerido, entero, mínimo 0.

## VentaRequest
- **cliente**: requerido, texto 3-255 caracteres, trim y escape.
- **producto_id**: requerido, entero positivo.
- **cantidad**: requerido, entero mínimo 1.
- **total**: requerido, numérico mínimo 0.
- **fecha**: requerida, formato YYYY-MM-DD.

## CajaRequest
- **concepto**: requerido, texto 3-255 caracteres, trim y escape.
- **monto**: requerido, numérico mínimo 0.
- **fecha**: requerida, formato YYYY-MM-DD.
