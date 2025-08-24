# ADR-002 — Persistencia SQLite + Journaling (WAL)
**Estado:** Propuesto  
**Fecha:** 24/08/2025  
**Decisores:** Equipo Tortillería (PO, Tech Lead)

## Contexto
Operación 100% offline en Windows (≥4 GB RAM) tolerando cortes de energía/cierres inesperados; lectura concurrente fluida (POS/reportes), integridad de inventario/kardex/ventas y backups/restore simples.

## Decisión
Usar **SQLite** local con **Write-Ahead Logging (WAL)**, política de **checkpoints**, medidas de **anti-corrupción** y **backups/restore guiados**.

### PRAGMAs oficiales (prod; modo rendimiento entre paréntesis)
- `PRAGMA journal_mode = WAL;`
- `PRAGMA synchronous = NORMAL;` (**FULL** en “corte de caja”, migraciones y actualización offline)
- `PRAGMA foreign_keys = ON;`
- `PRAGMA busy_timeout = 5000;`
- `PRAGMA wal_autocheckpoint = 1000;` (ajustable por métricas)
- `PRAGMA locking_mode = NORMAL;`
- `PRAGMA temp_store = MEMORY;`
- **Al crear DB**: `PRAGMA page_size = 4096;`
- Mantenimiento: `PRAGMA auto_vacuum = INCREMENTAL;` + `PRAGMA incremental_vacuum;`
- Seguridad: `PRAGMA trusted_schema = OFF;`
- Versionado: `PRAGMA user_version = <entero>`

### Rutas Windows
- Elegida: `C:\\ProgramData\\Tortilleria\\data\\app.sqlite`  
- Alternativa (por usuario): `%LocalAppData%\\Tortilleria\\data\\app.sqlite`

## Alternativas consideradas
PostgreSQL local; SQL Server Express LocalDB; archivos JSON/CSV; SQLite sin WAL.

## Consecuencias
**Pro:** setup mínimo, ACID, buena lectura concurrente con WAL, backups sencillos.  
**Contra:** gestionar tamaño del WAL/checkpoints; ajustar `synchronous` por caso.

## RNF soportados
Rendimiento (≥100 ventas/hora), confiabilidad tras crash, integridad (transacciones + FK), operación offline, seguridad (cifrado de backups), mantenibilidad (PRAGMAs documentados y métricas).

## Estrategia WAL y checkpoints
- Automático: `wal_autocheckpoint = 1000` páginas (ajustable).  
- Manual (forzado): al salir, tras **corte de caja** (con `synchronous=FULL`) y cuando **WAL > 256 MB** → `PRAGMA wal_checkpoint(TRUNCATE);` (fallback a `PASSIVE`).

## Plan anti-corrupción
Transacciones en operaciones críticas; `synchronous=NORMAL` por defecto y **FULL** en eventos críticos; `PRAGMA quick_check` semanal; recuperación con **Backup API** y registro del incidente.

## Backups & restore
Diario (reten 7) y semanal (reten 4) + USB opcional; verificación con `PRAGMA integrity_check` sobre el **backup**; cifrado (ZIP/AES o EFS); restore atómico guiado.

## Observabilidad
Log inicial de PRAGMAs/rutas; métricas (DB/WAL/tiempo checkpoint/`SQLITE_BUSY`/recoveries); alertas: WAL >256 MB, `quick_check` fallido, ≥3 `BUSY`/60s.

## Métricas de aceptación
Resiliencia a crash (abre y pasa `quick_check`); WAL controlado (<256 MB o checkpoint a tiempo); corte de caja seguro con **FULL**; backup/restore en ≤ 5 min.

## Plan de adopción
Congelar PRAGMAs y rutas → automatizar checkpoints → `quick_check` semanal y pipeline de backups → logs/alertas → ensayo de recuperación.

## Aprobaciones
- Tech Lead: ______ (fecha)  
- QA Lead: ________ (fecha)  
- Cliente/PO: _____ (fecha)
