# C4 — Diagrama de Contenedores · Sistema Tortillería

```mermaid
flowchart LR
  subgraph S[Tortillería · App Desktop Offline]
    shell[NativePHP · Shell Desktop]:::container
    ui[Vue 3 + Tailwind · UI]:::container
    core[Laravel Core<br/>(Inventario/Kardex, Ventas/POS, Cajas, Reparto, Reportes, Auditoría)]:::container
    db[(SQLite local)]:::database
    sync[Agente de Sync / Colas<br/>SQLite ⇄ PostgreSQL]:::container
    pdf[Servicio PDF / Impresión]:::container
    backup[Servicio Backups/Restore]:::container
    logs[Logs + Auditoría]:::container
    updater[Actualizador Offline + Rollback]:::container
  end

  printer[[Impresora / PDF Viewer]]:::external
  usb[[USB (cifrado)]]:::external
  pg[(PostgreSQL SaaS)]:::external

  shell --> ui
  ui --> core
  shell <--> core
  core --> db
  core --> pdf
  core --> logs
  core --> backup
  sync --> db

  pdf --- printer
  backup --- usb
  sync --- pg

  classDef container fill:#fff,stroke:#666,stroke-width:1px;
  classDef database fill:#fffbe6,stroke:#eab308,stroke-width:1px;
  classDef external fill:#eef6ff,stroke:#3b82f6,stroke-width:1px;
```
