# Observabilidad SQLite

## Logs iniciales
- Ruta real de la base de datos y del WAL.
- Valores efectivos de los PRAGMAs claves.

## Métricas
- Tamaño de la base y del WAL.
- Duración de cada checkpoint.
- Conteo de `SQLITE_BUSY`.
- Número de recuperaciones ejecutadas.

## Umbrales y alertas
- WAL > 256 MB → alerta "Requiere checkpoint".
- `quick_check` fallido → alerta crítica "Integridad comprometida".
- ≥3 `BUSY` en 60s → aviso "Alta contención".

## Formato de log (ejemplo)
```json
{
  "ts": "2025-08-24T12:00:00Z",
  "event": "startup",
  "db_path": "C:/ProgramData/Tortilleria/data/app.sqlite",
  "pragmas": {
    "journal_mode": "wal",
    "synchronous": "normal",
    "wal_autocheckpoint": 1000
  }
}
```
