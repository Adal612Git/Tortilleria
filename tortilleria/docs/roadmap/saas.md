# Roadmap SaaS (multitenencia y sincronización)

## Fase 1 (Desktop offline)
- SQLite + WAL; backups; empaquetado; RBAC; reportes.

## Fase 2 (Sync & Multitenant)
- Sync diferido SQLite⇄PostgreSQL; resolución de conflictos; colas idempotentes.
- Multitenencia: `tenant_id` (v1) → esquemas (v2) → DB por tenant (v3) según escala y aislamiento.

## Fase 3 (SaaS Operativo)
- Panel de tenants; facturación; monitoreo; despliegues azules; backups multi-tenant; operación 24/7.
