# Diseño de Auditoría

## Eventos críticos
- Login/logout, altas/bajas/ajustes de inventario, Masa→Totopos, ventas, cortes de caja, entregas, backups/restore, actualizaciones/rollback.

## Modelo (inmutable)
- Usuario/rol, timestamp, entidad/ID, tipo de evento, payload mínimo (antes/después cuando aplique), host/IP (si disponible). Registros **append-only**.

## Retención
- 12 meses (configurable por política).

## Consulta/Export
- Visor por rango/entidad/usuario; filtros por tipo; export CSV/PDF.
