# Sistema de Auditoría

Este módulo provee un registro independiente de actividades relevantes dentro de la aplicación.

## Tabla `audit_logs`

| Campo      | Tipo    | Descripción                                   |
|-----------|---------|-----------------------------------------------|
| id        | integer | Identificador incremental.                    |
| user_id   | integer | ID de usuario responsable. Puede ser `null`. |
| action    | string  | Nombre del evento auditado.                   |
| payload   | json    | Datos asociados al evento.                    |
| created_at| datetime| Fecha y hora del evento.                      |

## Middleware `AuditLogger`

El middleware `audit` captura las peticiones y crea un registro en `audit_logs`. Para usarlo:

```php
Route::post('/ventas', function () {
    // ...
})->middleware('audit:venta_creada');
```

El parámetro pasado al middleware representa la acción a registrar. El cuerpo de la solicitud se almacena como `payload`.

## Retención de registros

La cantidad de días que se conservarán los logs se define con la variable de entorno `AUDIT_LOG_RETENTION_DAYS` (por defecto 180).

Existe un comando para eliminar registros antiguos:

```bash
php artisan audit:prune
```

## Ejemplos

Insertar y consultar registros:

```sql
-- Insert manual
INSERT INTO audit_logs (user_id, action, payload) VALUES (NULL, 'venta_creada', '{}');

-- Consultar
SELECT * FROM audit_logs WHERE action = 'venta_creada';
```
