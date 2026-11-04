# Implementation Tasks — SPEC-000

## Domain

- [ ] T001 — Confirmar que las operaciones de sandbox usan únicamente dinero virtual. Reqs: `REQ-ALPHA-002`. Validación: tests de compra/venta.
- [ ] T002 — Confirmar que Before Selling no bloquea la decisión del usuario. Reqs: `REQ-ALPHA-003`. Validación: tests de escenarios.
- [ ] T003 — Auditar que las reglas financieras y conductuales no estén duplicadas en React. Reqs: `REQ-ALPHA-004`. Validación: revisión de código.

## Application

- [ ] T004 — Auditar que Vyra solo reciba señales calculadas y observables. Reqs: `REQ-ALPHA-005`. Validación: tests de explicación.
- [ ] T005 — Identificar cualquier dependencia externa del flujo central. Reqs: `REQ-ALPHA-006`. Validación: matriz de dependencias.

## Infrastructure

- [ ] T006 — Mantener el adaptador local/en memoria como camino predeterminado de la demo. Reqs: `REQ-ALPHA-001`, `REQ-ALPHA-006`. Validación: ejecución sin Internet.

## API

- [ ] T007 — Verificar que los contratos del recorrido están documentados y no requieren autenticación. Reqs: `REQ-ALPHA-001`, `REQ-ALPHA-002`. Validación: revisión de endpoints.

## Frontend

- [ ] T008 — Ejecutar el recorrido Learn → Invest → caída → Before Selling → decisión → reflexión y registrar brechas. Reqs: `REQ-ALPHA-001`. Validación: checklist manual móvil/escritorio.
- [ ] T009 — Verificar estados de error recuperables y ausencia de bloqueo durante Before Selling. Reqs: `REQ-ALPHA-003`. Validación: pruebas exploratorias.

## Testing

- [ ] T010 — Añadir solo tests para brechas detectadas en T001–T009. Reqs: todos. Validación: suite backend/frontend.
- [ ] T011 — Verificar que ningún test dependa de Internet o servicios pagados. Reqs: `REQ-ALPHA-001`, `REQ-ALPHA-006`. Validación: ejecución offline.

## Validation

- [ ] T012 — Ejecutar build backend y tests existentes.
- [ ] T013 — Ejecutar build frontend.
- [ ] T014 — Ejecutar demo offline desde un entorno local limpio.
- [ ] T015 — Validar `REQ-ALPHA-001`.
- [ ] T016 — Validar `REQ-ALPHA-002`.
- [ ] T017 — Validar `REQ-ALPHA-003`.
- [ ] T018 — Validar `REQ-ALPHA-004`.
- [ ] T019 — Validar `REQ-ALPHA-005`.
- [ ] T020 — Validar `REQ-ALPHA-006`.
