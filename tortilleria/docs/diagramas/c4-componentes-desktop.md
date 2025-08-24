# C4 — Componentes (Desktop · NativePHP)

```mermaid
flowchart LR
  subgraph Desktop[Tortillería · App Desktop (NativePHP)]
    shell[Shell NativePHP (ventanas, tray, lifecycle)]:::cmp
    ui[UI Vue 3 + Tailwind]:::cmp
    updater[Actualizador Offline + Rollback]:::svc
    printpdf[Servicio PDF/Impresión]:::svc
    backup[Backups/Restore GUI]:::svc
    sync[Agente de Sync / Colas (SQLite ⇄ PostgreSQL)]:::svc
    metrics[Logs + Métricas locales]:::infra
    cfg[Config/ENV Desktop]:::infra
  end

  %% Relaciones
  shell --> ui
  shell --> updater
  ui --> printpdf
  ui --> backup
  ui --> metrics
  shell --> sync
  sync --> metrics

  %% Externos
  printer[[Impresora/PDF Viewer]]:::ext
  usb[[USB (cifrado)]]:::ext
  pg[(PostgreSQL SaaS)]:::ext

  printpdf --- printer
  backup --- usb
  sync --- pg

  classDef cmp fill:#fff,stroke:#666,stroke-width:1px;
  classDef svc fill:#eef6ff,stroke:#3b82f6,stroke-width:1px;
  classDef infra fill:#f6f6f6,stroke:#999,stroke-width:1px;
  classDef ext fill:#e8f5e9,stroke:#2e7d32,stroke-width:1px;
```

Notas

Offline-first: todo opera sin red; sync solo con conexión.

Updater: paquetes firmados + rollback.

Backups: locales/USB, cifrados.
