# Registro de continuidad SDD

## 2026-11-03 — Adopción de Constitution

- **Estado:** Constitution v0.2.0 adoptada y aprobada por el Product Owner.
- **Aprendizaje:** la Constitution es la autoridad normativa superior; `AGENTS.md` gobierna el procedimiento de agentes.
- **Commit:** `3c6a1bc`, con limpieza de formato en `a19f212`.
- **Siguiente paso:** ejecutar tareas de `SPEC-000`.

## 2026-11-03 — Auditoría de November Alpha

- **Estado:** auditoría documentada; la Alpha aún no estaba validada.
- **Hallazgos:** escenarios duplicados, dependencia externa de fuentes visuales, modo autenticado fuera de `DEV`, proveniencia no formalizada, cifras hardcodeadas y accesibilidad pendiente.
- **Commit:** `dcbcced`.
- **Siguiente paso:** convertir hallazgos en tareas correctivas.

## 2026-11-03 — Tareas correctivas

- **Estado:** `T021–T033` añadidas a `SPEC-000`.
- **Commit:** `f10b99b`.
- **Siguiente paso:** ejecutar las tareas en orden, sin crear nuevas features.

## 2026-11-03 — T021: escenarios autoritativos

- **Estado:** completada.
- **Avance:** el frontend dejó de construir escenarios locales; Before Selling consume escenarios de la API.
- **Validación:** 700 tests frontend y build correctos.
- **Commit:** `9e77a26`.
- **Siguiente paso:** `T022`.

## 2026-11-03 — T022: proveniencia de datos

- **Estado:** completada.
- **Avance:** se añadieron clasificaciones estables de proveniencia para datos simulados, externos y calculados.
- **Validación:** backend, tests backend, 700 tests frontend y build correctos.
- **Commit:** `bcab002`.
- **Siguiente paso:** `T023`.

## 2026-11-03 — T023: demo visual offline

- **Estado:** completada.
- **Avance:** se eliminó la importación externa de Google Fonts.
- **Validación:** 700 tests frontend y build correctos.
- **Commit:** `0fa7703`.
- **Siguiente paso:** `T024`.

## 2026-11-03 — T024: demo sin autenticación obligatoria

- **Estado:** completada.
- **Avance:** la identidad local/provisional funciona también en una build local; autenticación queda como modo explícito de prueba.
- **Validación:** 700 tests frontend y build correctos.
- **Commit:** `8917b04`.
- **Siguiente paso:** `T025`.

## 2026-11-03 — T025: métricas autoritativas de Before Selling

- **Estado:** completada.
- **Avance:** pérdida y volatilidad se añadieron al contrato y la UI dejó de reconstruir esos valores.
- **Validación:** backend, tests backend, 700 tests frontend y build correctos.
- **Commit:** `b26050c`.
- **Siguiente paso:** `T026`.

## 2026-11-03 — T026: regresión contra cifras hardcodeadas

- **Estado:** completada.
- **Avance:** se añadió una prueba con pérdida `−17.5%`, volatilidad `66` y escenarios distintos al caso de referencia.
- **Validación:** 700 tests frontend y build correctos.
- **Commit:** `679c1c6`.
- **Siguiente paso:** `T027`.

## 2026-11-03 — T027: accesibilidad de Before Selling

- **Estado:** completada.
- **Avance:** descripción accesible, foco inicial, cierre, retorno de foco y acciones verificadas.
- **Validación:** 701 tests frontend y build correctos.
- **Commit:** `83216bf`.
- **Siguiente paso:** `T028`.

## 2026-11-03 — Continuidad hacia T028

- **Estado:** se retoma el plan SDD tras establecer la memoria operativa.
- **Objetivo:** añadir regresiones que impidan duplicar escenarios o divergir de los valores de la API.
- **Regla aplicada:** implementar solo `T028`, validar y registrar el resultado antes de continuar.

## 2026-11-03 — T028: regresiones de autoridad API/UI

- **Estado:** completada.
- **Avance:** el cliente API conserva las métricas de Before Selling y la UI prueba que renderiza valores dinámicos distintos al caso hardcodeado.
- **Validación:** 13 archivos frontend, 702 tests correctos y build frontend correcto.
- **Siguiente paso:** `T029`.

## 2026-11-03 — Continuidad hacia T029

- **Estado:** se continúa el plan SDD después de cerrar T028.
- **Objetivo:** probar degradación segura sin autenticación, PostgreSQL, CoinGecko ni red externa.
- **Regla aplicada:** validar primero el comportamiento existente; cambiar producción solo si la evidencia muestra una brecha.

## 2026-11-03 — T029: degradación sin servicios externos

- **Estado:** completada.
- **Avance:** se añadió regresión para iniciar la Alpha sin sesión autenticada; se conservaron las pruebas de fallback demo sin red y de CoinGecko no disponible.
- **Validación:** 13 archivos frontend, 703 tests correctos, build frontend correcto y suite backend correcta.
- **Siguiente paso:** `T030`.

## 2026-11-03 — Continuidad hacia T030

- **Estado:** se continúa el plan SDD después de cerrar T029.
- **Objetivo:** verificar proveniencia y etiquetado de cotizaciones, escenarios y respuestas de Vyra.
- **Regla aplicada:** los tests deben proteger los contratos constitucionales sin introducir nuevas funcionalidades.

## 2026-11-03 — T030: tests de proveniencia

- **Estado:** completada.
- **Avance:** los escenarios de Before Selling incluyen `SYSTEM_CALCULATED` y la suite verifica proveniencia simulada, externa y calculada.
- **Validación:** backend compila y pasa su suite; frontend tiene 703 tests correctos y build correcto.
- **Siguiente paso:** `T031`.
