# Roadmap SaaS

## Estrategia de multitenencia y sincronización

1. **Fase 1 — `tenant_id`:** todas las tablas incluyen `tenant_id`; sincronización básica con SaaS.
2. **Fase 2 — Esquemas por tenant:** aislamiento lógico con `schema` dedicado; migraciones preparadas desde inicio.
3. **Fase 3 — Base de datos por tenant:** despliegue independiente, backups y restauración por cliente.

La aplicación local prepara la "fase 2" desde el diseño, permitiendo migrar a esquemas dedicados sin refactorización mayor.
