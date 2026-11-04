# Technical Plan — PLAN-ALPHA-001

## Related Specification

[`SPEC-000 — Nuvyra November Alpha`](./spec.md)

## Existing Architecture Analysis

El repositorio ya dispone de un monolito modular ASP.NET Core, frontend React/Vite, sandbox en memoria, contenido educativo, señales deterministas, Before Selling y tests de dominio. La Alpha reutiliza estas piezas y no introduce una nueva arquitectura.

## Proposed Changes

Priorizar integración, validación y documentación del recorrido existente. No añadir PostgreSQL, autenticación ni servicios externos al flujo central.

## Components Affected

`apps/web`, `src/Nuvyra.Domain`, `src/Nuvyra.Application`, `src/Nuvyra.Infrastructure`, `src/Nuvyra.Api`, `tests` y documentación de demo.

## Domain Changes

Ninguno previsto sin detectar una brecha concreta contra `SPEC-000`. Las reglas permanecen deterministas y fuera de React.

## Application Changes

Solo coordinación mínima si una prueba del recorrido demuestra una brecha. No crear nuevos casos de uso por anticipación.

## Infrastructure Changes

Mantener datos locales/en memoria para la demo. PostgreSQL queda fuera del alcance de este plan.

## API Changes

Reutilizar contratos existentes de sandbox, curso, mercado simulado, Before Selling y Vyra. No introducir endpoints de autenticación o persistencia en esta Alpha.

## Frontend Changes

Validar que el recorrido Learn → Invest → caída → Before Selling → decisión → reflexión sea accesible en móvil y escritorio, con estados de error recuperables.

## Data Model

Datos virtuales y temporales del sandbox. No se requiere esquema persistente.

## Data Flow

`Lección → Pulso/contexto → Posición virtual → Evento simulado → Señales deterministas → Before Selling → Escenario elegido → Reflexión`

## Algorithms

Usar los cálculos deterministas existentes. Ningún modelo generativo participa como fuente de verdad.

## Interfaces / Contracts

No cambiar identificadores públicos existentes sin una spec adicional y revisión de compatibilidad.

## Testing Strategy

Conservar tests existentes, añadir solo pruebas de brechas del recorrido y validar manualmente el escenario offline. Backend y frontend deben seguir construyendo sin servicios externos.

## Migration / Compatibility

Sin migración. Los cambios deben ser compatibles con la demo actual y no exigir PostgreSQL, credenciales o Internet.

## Risks

- Cambios previos de autenticación/persistencia pueden confundirse con el alcance Alpha.
- Una dependencia de mercado externo puede romper la demo offline.
- Documentación histórica puede describir reglas descartadas.

Mitigación: marcar claramente el alcance, usar datos simulados y tratar la documentación vigente como fuente de decisión.

## Alternatives Considered

- PostgreSQL como requisito: descartado para conservar `$0 MXN` y offline.
- Autenticación completa: descartada por no ser necesaria para el hero flow.
- Refactor arquitectónico: descartado por la restricción de cambio mínimo.

## Definition of Done

- Todos los requisitos de `SPEC-000` tienen tarea y validación.
- El escenario completo funciona localmente sin Internet.
- No se requiere PostgreSQL, autenticación, cloud ni servicios pagados.
- Tests y build pasan.
- La spec, el plan y las tareas coinciden con la implementación.
- La evidencia queda lista para revisión humana y PR.
