# ADR-0001 — Stack Desktop Offline (Laravel + NativePHP + Vue 3 + Tailwind)
**Estado:** Propuesto  
**Fecha:** 2025-08-23  
**Decisores:** Equipo Tortillería (PO, Tech Lead)

## Contexto
Necesitamos una app **offline-first** para Windows (≥4 GB RAM), con **instalador .msi/.exe**, **UI limpia**, **RBAC** (Dueño/Supervisor/Admin/Despachador/Repartidor) y **ruta a SaaS** futura (multi-tenant y sync a PostgreSQL). Núcleo: **Inventario + Kardex**, conversión **Masa→Totopos**, **Ventas/POS**, **Cajas**, **Reparto**, **reportes** y **auditoría**.

## Decisión
- **Backend:** Laravel (PHP 8.x)  
- **Desktop/Packaging:** NativePHP (app desktop offline; instalador .msi/.exe)  
- **Frontend:** Vue 3 + Tailwind (assets locales, sin CDNs)  
- **Datos local:** SQLite (journaling/WAL)  
- **Sync SaaS:** PostgreSQL (colas diferidas, resolución de conflictos)  
- **Seguridad:** Auth local + RBAC estricto; auditoría inmutable; rate limiting local

## Alternativas consideradas
1. Electron + Vite → consumo RAM/peso alto para HW modesto.  
2. Tauri (Rust) + Vue → binarios ligeros pero mayor complejidad y menor alineación con Laravel.  
3. .NET (WPF/WinUI) + API Laravel → stack mixto incrementa costos y doble capa.  
4. Laravel servidor local + navegador → experiencia no-desktop, updates y systray más toscos.

## Consecuencias
**Pro:** baja huella vs Electron; reuso de dominio Laravel; packaging offline/rollback viable.  
**Contra:** diseñar bien sync SQLite⇄Postgres; empaquetado extra si se pide macOS/Linux; disciplina en assets locales y “modo rendimiento”.

## Requisitos no funcionales (RNF)
- Rendimiento: ≥100 ventas/hora en 4 GB RAM; UI sin bloqueos perceptibles.  
- Confiabilidad offline: operaciones core sin red; journaling/WAL; reintentos.  
- Integridad: transacciones atómicas en inventario/ventas/kardex; auditoría inmutable.  
- Seguridad: hashing fuerte, rate-limit local, RBAC por recurso, cifrado de DB/backups.  
- Operabilidad: instalador .msi/.exe; updates offline firmadas con **rollback**.  
- Mantenibilidad: modular; tests unit/E2E; logs legibles y visor.  
- Portabilidad: plan SaaS (tenant_id) y Postgres.

## Riesgos y mitigaciones
- Cortes de energía → backups + WAL/journaling + restore guiado.  
- Equipos limitados → modo rendimiento y lotes de escritura.  
- Robo/pérdida → cifrado de DB y respaldos; rotación de llaves.  
- Conflictos de sync → política por entidad (p.ej., LWW/CRDT), colas idempotentes.

## Impacto en arquitectura
- Dominio en Laravel; capa desktop gestiona ventanas/auto-update/permisos FS.  
- Persistencia con repositorios SQLite y adaptadores de sync a Postgres.

## Métricas de aceptación
- Instalación limpia en VM sin red.  
- Flujo login→venta→corte→reporte offline OK.  
- Kardex registra entradas/salidas/transformaciones (tests).  
- Consumo idle objetivo <300MB; instalador objetivo <200MB.  
- Rollback post-update restituye versión previa con datos íntegros.

## Plan de adopción
Sprints 1–6 según plan; empaquetado base S1; QA/operación S5; firma final S6; USB maestro S6.

## Aprobaciones
- Tech Lead: ______ (fecha)  
- QA Lead: ________ (fecha)  
- Cliente/PO: _____ (fecha)  
