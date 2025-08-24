# Runbook — Recuperación SQLite

1. **Detectar** el incidente (logs, error en apertura, alerta de integridad).
2. **Poner la app en modo lectura-sola**; bloquear nuevas escrituras.
3. Si el WAL supera el umbral o hay inconsistencia, ejecutar `PRAGMA wal_checkpoint(TRUNCATE);`.
4. **Generar backup** con la **SQLite Backup API** hacia un archivo temporal seguro.
5. Ejecutar `PRAGMA integrity_check` sobre el **backup** para validar consistencia.
6. **Restore atómico**: reemplazar la base dañada por el backup verificado.
7. **Verificar**: abrir la app y correr `PRAGMA quick_check`.
8. **Registrar el incidente**: bitácora con causa raíz, acciones y resultado.
