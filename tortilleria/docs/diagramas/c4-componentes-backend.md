# C4 — Componentes (Backend · Laravel Core)

```mermaid
flowchart LR
  %% Backend por bounded context
  subgraph Backend[Backend Laravel Core]
    subgraph InvKardex[BC: Inventario & Kardex]
      inv_srv[Svc Inventario]:::cmp
      kardex_srv[Svc Kardex]:::cmp
      inv_repo[Repo Inventario]:::repo
      kardex_repo[Repo Kardex]:::repo
    end

    subgraph VentasCajas[BC: Ventas & Cajas]
      pos_srv[Svc POS]:::cmp
      caja_srv[Svc Cajas]:::cmp
      pdf_comp[Componente PDF]:::svc
    end

    subgraph Reparto[BC: Reparto]
      reparto_srv[Svc Reparto]:::cmp
    end

    subgraph ReportesAudit[BC: Reportes & Auditoría]
      report_srv[Svc Reportes]:::cmp
      audit_log[Auditoría (Log/Trail)]:::infra
    end

    subgraph Seguridad[BC: Seguridad]
      auth[Auth Local]:::infra
      rbac[RBAC / Policies]:::infra
      val[Validación/Sanitización]:::infra
    end

    subgraph Infra[Infra: Colas & Caché]
      jobs[Colas (Laravel Queue · DB driver)]:::infra
      cache[Cache (file)]:::infra
      events[Eventos de Dominio]:::infra
    end
  end

  %% Conexiones principales
  inv_srv --> inv_repo
  kardex_srv --> kardex_repo
  pos_srv --> pdf_comp
  caja_srv --> audit_log
  reparto_srv --> audit_log
  report_srv --> audit_log

  %% Infra común
  inv_srv --> jobs
  kardex_srv --> jobs
  pos_srv --> jobs
  caja_srv --> jobs
  reparto_srv --> jobs

  inv_srv --> cache
  pos_srv --> cache
  report_srv --> cache

  %% Estilos
  classDef cmp fill:#fff,stroke:#666,stroke-width:1px;
  classDef repo fill:#fffbe6,stroke:#eab308,stroke-width:1px;
  classDef svc fill:#eef6ff,stroke:#3b82f6,stroke-width:1px;
  classDef infra fill:#f6f6f6,stroke:#999,stroke-width:1px;
```

Leyenda

BC: bounded context (límite funcional).

Svc/Componente: servicios de aplicación.

Repo: acceso a datos (SQLite).

Infra: colas, cache, auditoría, auth/policies.
