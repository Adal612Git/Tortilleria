# Seguridad — Validación y Sanitización

- Todas las entradas se validan con reglas explícitas (tipos, rangos, formatos).
- Sanitizar cadenas: `trim`, normalización UTF-8, escape de HTML.
- Mensajes de error claros y localizados.
- Al fallar la validación se responde con **422** y detalle del campo.
- Registrar intentos inválidos y regresar respuestas consistentes.
