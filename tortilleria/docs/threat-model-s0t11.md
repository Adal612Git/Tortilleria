# Threat Model S0T11

## Activos clave
- Inventario
- Ventas
- Caja
- Usuarios

## Amenazas (STRIDE simplificado)

### Spoofing (abuso de roles)
- **Amenaza:** Usuarios malintencionados se hacen pasar por administradores para modificar operaciones.
- **Mitigación:** Autenticación multifactor y revisiones periódicas de privilegios.

### Tampering (manipulación de archivos)
- **Amenaza:** Alteración de archivos de configuración o registros de ventas.
- **Mitigación:** Controles de integridad y uso de control de versiones con permisos restringidos.

### Repudiation (ventas anuladas sin registro)
- **Amenaza:** Empleados anulan ventas sin que quede evidencia.
- **Mitigación:** Registro inmutable de eventos y auditorías frecuentes.

### Information Disclosure
- **Amenaza:** Exposición de información de clientes y precios.
- **Mitigación:** Cifrado en reposo y en tránsito, políticas de acceso mínimo.

### Denial of Service
- **Amenaza:** Saturación del sistema de ventas y caja.
- **Mitigación:** Monitoreo de tráfico y escalado automático de recursos.

### Elevation of Privilege
- **Amenaza:** Escalada de permisos para ejecutar acciones críticas.
- **Mitigación:** Revisión de roles y pruebas de penetración regulares.

## Tabla de priorización

| Amenaza | Impacto | Probabilidad |
|---------|---------|--------------|
| Spoofing (abuso de roles) | Alto | Medio |
| Tampering (manipulación de archivos) | Alto | Bajo |
| Repudiation | Medio | Medio |
| Information Disclosure | Alto | Bajo |
| Denial of Service | Alto | Medio |
| Elevation of Privilege | Crítico | Bajo |

## Responsables
- Equipo de Seguridad
- Equipo de Desarrollo
