# Implementation Tasks — SPEC-000

## Domain

- [ ] T001 — Confirmar que las operaciones de sandbox usan únicamente dinero virtual. Reqs: `REQ-ALPHA-002`. Validación: tests de compra/venta.
- [ ] T002 — Confirmar que Before Selling no bloquea la decisión del usuario. Reqs: `REQ-ALPHA-003`. Validación: tests de escenarios.
- [ ] T003 — Auditar que las reglas financieras y conductuales no estén duplicadas en React. Reqs: `REQ-ALPHA-004`. Validación: revisión de código.
- [ ] T021 — Eliminar la duplicación de escenarios financieros entre frontend y backend; definir un único origen autoritativo. Hallazgo: `A-001`. Reqs: `REQ-ALPHA-003`, `REQ-ALPHA-004`. Validación: revisión de dependencias y tests de escenarios.

## Application

- [ ] T004 — Auditar que Vyra solo reciba señales calculadas y observables. Reqs: `REQ-ALPHA-005`. Validación: tests de explicación.
- [ ] T005 — Identificar cualquier dependencia externa del flujo central. Reqs: `REQ-ALPHA-006`. Validación: matriz de dependencias.
- [ ] T022 — Formalizar el contrato de proveniencia de cotizaciones, señales y respuestas de Vyra. Hallazgo: `A-004`. Reqs: `REQ-ALPHA-004`, `REQ-ALPHA-005`. Validación: contratos y tests distinguen `SIMULATED`, `EXTERNAL_CURRENT`, `HYPOTHETICAL` y `UNAVAILABLE` cuando aplique.

## Infrastructure

- [ ] T006 — Mantener el adaptador local/en memoria como camino predeterminado de la demo. Reqs: `REQ-ALPHA-001`, `REQ-ALPHA-006`. Validación: ejecución sin Internet.
- [ ] T023 — Garantizar que fuentes, configuración y dependencias visuales no requieran Internet para la demo. Hallazgo: `A-003`. Reqs: `REQ-ALPHA-001`, `REQ-ALPHA-006`. Validación: ejecución offline reproducible.
- [ ] T024 — Verificar que autenticación y PostgreSQL no sean necesarios para el recorrido central fuera de `DEV`; mantener el usuario local/provisional. Hallazgo: `A-002`. Reqs: `REQ-ALPHA-001`, `REQ-ALPHA-006`. Validación: ejecución local construida sin cadena de conexión.

## API

- [ ] T007 — Verificar que los contratos del recorrido están documentados y no requieren autenticación. Reqs: `REQ-ALPHA-001`, `REQ-ALPHA-002`. Validación: revisión de endpoints.
- [ ] T025 — Exponer los valores de Before Selling desde el contrato autoritativo sin que la UI reconstruya cifras. Hallazgo: `A-005`. Reqs: `REQ-ALPHA-003`, `REQ-ALPHA-004`. Validación: escenarios API/UI coinciden bajo caída simulada.

## Frontend

- [ ] T008 — Ejecutar el recorrido Learn → Invest → caída → Before Selling → decisión → reflexión y registrar brechas. Reqs: `REQ-ALPHA-001`. Validación: checklist manual móvil/escritorio.
- [ ] T009 — Verificar estados de error recuperables y ausencia de bloqueo durante Before Selling. Reqs: `REQ-ALPHA-003`. Validación: pruebas exploratorias.
- [ ] T026 — Sustituir valores hardcodeados de la intervención por datos calculados y etiquetados del escenario. Hallazgo: `A-005`. Reqs: `REQ-ALPHA-003`, `REQ-ALPHA-005`. Validación: test con valores distintos de la caída de referencia.
- [ ] T027 — Ejecutar revisión de accesibilidad del diálogo Before Selling: foco, teclado, lector de pantalla, cierre y continuidad. Hallazgo: `A-006`. Reqs: `REQ-ALPHA-003`. Validación: checklist manual reproducible.

## Testing

- [ ] T010 — Añadir solo tests para brechas detectadas en T001–T009. Reqs: todos. Validación: suite backend/frontend.
- [ ] T011 — Verificar que ningún test dependa de Internet o servicios pagados. Reqs: `REQ-ALPHA-001`, `REQ-ALPHA-006`. Validación: ejecución offline.
- [ ] T028 — Añadir tests que impidan reintroducir escenarios duplicados o cifras financieras divergentes entre API y UI. Hallazgos: `A-001`, `A-005`. Reqs: `REQ-ALPHA-003`, `REQ-ALPHA-004`.
- [ ] T029 — Añadir tests de degradación sin autenticación, PostgreSQL, CoinGecko ni fuentes externas. Hallazgos: `A-002`, `A-003`. Reqs: `REQ-ALPHA-001`, `REQ-ALPHA-006`.
- [ ] T030 — Añadir tests de procedencia y etiquetado de datos para cotizaciones, escenarios y respuestas de Vyra. Hallazgo: `A-004`. Reqs: `REQ-ALPHA-004`, `REQ-ALPHA-005`.

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
- [ ] T031 — Repetir la auditoría constitucional y cerrar `A-001` a `A-006` solo con evidencia verificable.
- [ ] T032 — Ejecutar el hero flow completo sin Internet desde un entorno local construido, no solo en modo `DEV`.
- [ ] T033 — Registrar evidencia móvil/escritorio y accesibilidad del recorrido completo.
