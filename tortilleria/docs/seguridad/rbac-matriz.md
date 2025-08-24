# Matriz RBAC — Sistema Tortillería

| Recurso                | Dueño | Supervisor | Admin | Despachador | Repartidor |
|------------------------|:-----:|:----------:|:-----:|:-----------:|:----------:|
| Inventario / Kardex    | CRUD  |    CRUD    | CRUD  |      R      |     R      |
| Venta / Cobro          | CRUD  |    CRUD    | CRUD  |     C/R     |     R      |
| Cajas (apertura/corte) |  Sí   |     Sí     |  No   |     No      |     No     |
| Reparto / Entregas     |   R   |     R      |  R    |    CRUD     |     C      |
| Reportes               | Todos | Operativos |Operativos| Operativos | Personales |

**Regla crítica:** Empleados (Despachador/Repartidor) **no** pueden modificar el almacén.
