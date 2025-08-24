# Seguridad — Matriz RBAC

| Recurso \ Rol | Dueño | Supervisor | Admin | Despachador | Repartidor |
| --- | --- | --- | --- | --- | --- |
| Usuarios | C/R/U/D | C/R/U | R | - | - |
| Inventario | C/R/U/D | C/R/U | R | R | R |
| Ventas | C/R/U/D | C/R/U | R | C/R | C/R |
| Repartos | C/R/U/D | C/R/U | R | - | C/R |
| Almacén | C/R/U/D | C/R | R | - | - |
| Reportes | R | R | R | R | R |

**Regla:** empleados (Despachador, Repartidor) no alteran almacén.
