# Decisiones de Caché y Colas (Laravel · Desktop Offline)

## Caché
- **Driver**: `file` (por defecto) en entorno offline; ruta en disco de la app.
- **TTL**: corto para vistas/queries pesadas; invalidación en eventos de escritura.
- **Alternativa futura (SaaS)**: `redis` en nube.

## Colas
- **Driver**: `database` (SQLite) con tablas `jobs` y `failed_jobs`.
- **Backoff/Retries**: backoff exponencial (p.ej., 5s/15s/60s), `tries` por tipo de job.
- **Priorización**: colas separadas `critical`, `default`, `low`.
- **Persistencia offline**: los jobs quedan encolados y se atienden al relanzar la app o al volver la energía.
- **Futuro SaaS**: migración a `redis`/`sqs` con workers dedicados.

## Límite/Dependencias
- Evitar dependencias de red para operar (file/cache y DB queue locales).
- Jobs de `sync` quedan pausados si no hay Internet; se reanudan automáticamente.

## DoD (para esta decisión)
- Caché y colas documentadas y referenciadas desde C4.
- Entornos mapeados y valores por defecto definidos.
