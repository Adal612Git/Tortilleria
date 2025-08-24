# ADR-002 — Persistencia SQLite + Journaling (WAL)
**Estado:** Propuesto  
**Fecha:** 2025-08-24  
**Decisores:** Equipo Tortillería (PO, Tech Lead)

## Contexto
Operación 100% offline en Windows (≥4 GB RAM), tolerando cortes de energía y cierres inesperados, con lectura concurrente fluida (POS/reportes), integridad de inventario/kardex/ventas y backups/restore simples.

## Decisión
Usar **SQLite** local con **Write-Ahead Logging (WAL)**, política de checkpoints, anti-corrupción y respaldo.

### Ruta de la base de datos (Windows)
- **Elegida:** C:\\ProgramData\\Tortilleria\\data\\app.sqlite  
- **Alternativa:** %LocalAppData%\\Tortilleria\\data\\app.sqlite

### PRAGMAs oficiales (producción; modo rendimiento entre paréntesis)
- `PRAGMA journal_mode = WAL;`
- `PRAGMA synchronous = NORMAL;` *(**FULL** en operaciones críticas: “corte de caja”, migraciones y actualización offline).*
- `PRAGMA foreign_keys = ON;`
- `PRAGMA busy_timeout = 5000;`
- `PRAGMA wal_autocheckpoint = 1000;` *(ajustable por métricas)*
- `PRAGMA locking_mode = NORMAL;`
- `PRAGMA temp_store = MEMORY;`
- **Al crear DB**: `PRAGMA page_size = 4096;`
- Mantenimiento: `PRAGMA auto_vacuum = INCREMENTAL;` + `PRAGMA incremental_vacuum;`
- Seguridad: `PRAGMA trusted_schema = OFF;`
- Versionado: `PRAGMA user_version = <entero>`

## Alternativas consideradas
1) PostgreSQL local — robusto, pero instalación/servicio pesados para offline.  
2) SQL Server Express LocalDB — footprint mayor y complejidad.  
3) Archivos JSON/CSV — sin transacciones reales, riesgo de corrupción.  
4) SQLite sin WAL — menor concurrencia y mayor latencia de escritura.

## Consecuencias
**Pro:** setup mínimo, ACID, buena lectura concurrente con WAL, backups sencillos.  
**Contra:** gestionar tamaño del WAL y política de checkpoints; ajustar `synchronous` por caso.

## RNF soportados
Rendimiento (≥100 ventas/hora), confiabilidad tras crash, integridad (transacciones + FK), operación offline, seguridad (cifrado de backups), mantenibilidad (PRAGMAs documentados y métricas).

## Estrategia WAL y checkpoints
- Automático: `wal_autocheckpoint = 1000` páginas (ajustable).  
- Manual (forzado):
  - Al **salir** de la app.
  - Tras **corte de caja** (con `synchronous=FULL`).
  - Cuando **WAL > 256 MB** → `PRAGMA wal_checkpoint(TRUNCATE);` (fallback a `PASSIVE` si falla).

## Plan anti-corrupción (cierres inesperados)
- Transacciones en operaciones críticas.
- `synchronous=NORMAL` por defecto; **FULL** en eventos críticos.
- **Startup checks**: `PRAGMA quick_check` semanal o bajo demanda.
- **Runbook**: backup con **Backup API** → restore → verificación → reintentos; registrar incidente.

## Backups & restore
- Frecuencia: diario (reten 7), semanal (reten 4) + **USB** opcional.
- Método: **SQLite Backup API** (consistente con WAL).
- Verificación: `PRAGMA integrity_check` sobre el **backup**.
- Cifrado: ZIP/AES o EFS; custodiar llaves.
- Restore guiado: selector → verificación → reemplazo atómico → reabrir app.

## Observabilidad
- Log inicial: valores reales de PRAGMAs y rutas.
- Métricas: tamaño DB, tamaño WAL, tiempo de checkpoint, #`SQLITE_BUSY`, #recoveries.
- Alertas locales: WAL > 256 MB, `quick_check` fallido, ≥3 `BUSY`/60s.

## Métricas de aceptación
- Resiliencia a crash: tras abortar 100 escrituras, la DB abre y pasa `quick_check`.
- WAL controlado: no supera 256 MB bajo carga típica o se checkpoint-ea a tiempo.
- Corte de caja seguro: con **FULL**, latencia aceptable e integridad ok.
- Backup/restore: backup diario verificado y restore exitoso en ≤5 min.

## Plan de adopción
1) Congelar PRAGMAs y rutas.  
2) Automatizar checkpoints (salida/corte/umbral WAL).  
3) Programar `quick_check` semanal y pipeline de backups.  
4) Añadir logs/alertas.  
5) Ensayar recuperación (tabletop + prueba en QA).

## Aprobaciones
- Tech Lead: ______ (fecha)  
- QA Lead: ________ (fecha)  
- Cliente/PO: _____ (fecha)

