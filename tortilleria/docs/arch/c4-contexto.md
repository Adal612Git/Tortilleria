# C4 — Diagrama de Contexto · Sistema Tortillería

```mermaid
flowchart LR
  A[Cliente]:::actor
  B[Despachador / Repartidor]:::actor
  C[Dueño / Supervisor / Admin]:::actor

  subgraph S[Tortillería · App Desktop Offline]
  end

  P[[Impresora / PDF]]:::external
  U[[USB (Backups cifrados)]]:::external
  N[(PostgreSQL SaaS · Sync opcional)]:::external

  A -->|Compra / Ticket| S
  B -->|POS / Reparto| S
  C -->|Admin / Reportes| S

  S -->|Comprobantes| P
  S -->|Backups| U
  S ---|Sincroniza cuando hay Internet| N

  classDef actor fill:#f6f6f6,stroke:#999,stroke-width:1px;
  classDef external fill:#eef6ff,stroke:#3b82f6,stroke-width:1px;
```

Leyenda: Actores, Sistema, Externos.
