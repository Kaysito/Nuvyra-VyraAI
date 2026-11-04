# Auditoría de `SPEC-000` — November Alpha

Fecha: 2026-11-03  
Rama auditada: `codex/postgres-auth-onboarding`  
Tipo: auditoría de solo lectura; no se modificó código de producto.

## Estado general

La implementación existente cubre gran parte del hero flow: aprendizaje, pulso provisional, sandbox virtual, caída simulada, Before Selling, escenarios deterministas, señales observables y Vyra explicable.

Resultado: **no validada todavía**. Hay brechas que deben convertirse en tareas antes de declarar `SPEC-000` completa.

## Evidencia de validación ejecutada

- Backend: `dotnet build Nuvyra.slnx --configuration Release` — correcto, 0 advertencias y 0 errores.
- Tests backend: `dotnet run --project tests/Nuvyra.UnitTests --configuration Release --no-build` — correctos.
- Frontend: `npm run test:run` — 13 archivos, 701 tests correctos.
- Frontend build: `npm run build` — correcto.
- Estado Git: hay cambios locales previos de autenticación/PostgreSQL que no forman parte de esta auditoría ni fueron modificados.

## T001–T009

| Tarea | Resultado | Evidencia / observación |
|---|---|---|
| T001 | Parcialmente conforme | `VirtualPortfolio` y `NuvyraDemoService` usan saldo, posiciones y órdenes virtuales. Falta una prueba constitucional explícita que clasifique cada salida como simulada. |
| T002 | Conforme | `BeforeSell` genera escenarios y `ContinueSale`; la UI muestra “No hay temporizador ni bloqueo”. |
| T003 | No conforme | `PracticeView.tsx` mantiene `localDecisionScenarios()` además de los escenarios del dominio/API. Existe duplicación de reglas y valores financieros en frontend. |
| T004 | Parcialmente conforme | `ContextualInsightEngine` y `VyraInsightService` usan reglas deterministas y disclaimers. La procedencia no está modelada como clasificación constitucional estable. |
| T005 | Parcialmente conforme | El sandbox usa proveedor determinista, pero la aplicación también configura CoinGecko y carga Google Fonts. Debe verificarse que ambos sean opcionales para la demo offline. |
| T006 | Parcialmente conforme | La API puede operar sin cadena de conexión en modo `demo-memory`, pero el flujo frontend fuera de `DEV` muestra autenticación. La demo no debe depender del bypass de desarrollo. |
| T007 | Parcialmente conforme | Los contratos distinguen `source` como texto, pero no distinguen formalmente `SIMULATED`, `EXTERNAL_CURRENT`, `UNAVAILABLE` y estados equivalentes. |
| T008 | Parcialmente conforme | El recorrido está implementado y cubierto por tests, pero la UI hardcodea `−28%`, `Alta` y `$1,000` en la intervención mientras la API calcula valores reales del escenario. |
| T009 | Parcialmente conforme | Hay estados de error y mensajes recuperables. Falta una comprobación manual reproducible en móvil/escritorio sin Internet y una verificación completa de accesibilidad del diálogo. |

## Hallazgos priorizados

### A-001 — P1: reglas de escenarios duplicadas en frontend

`apps/web/src/components/practiceSession.ts` contiene escenarios locales que compiten con `NuvyraDemoService.BeforeSell`. La UI debe consumir la respuesta autoritativa del backend o de un proveedor determinista común.

Constitución relacionada: Integridad arquitectónica, proveniencia, sistemas de autoridad.

### A-002 — P1: recorrido offline no garantizado fuera de DEV

`App.tsx` activa una sesión demo automáticamente solo cuando `import.meta.env.DEV` es verdadero. En una ejecución local construida/preview sin base de datos, el usuario puede quedar frente al acceso, aunque `SPEC-000` exige un usuario local/provisional para el recorrido central.

Constitución relacionada: November Alpha, Offline-capable, fallos seguros.

### A-003 — P1: dependencia externa de Google Fonts

`apps/web/src/styles.css` importa fuentes desde `fonts.googleapis.com`. Esto hace que la presentación visual dependa de Internet, aunque el contenido pueda cargar localmente.

Constitución relacionada: Offline-capable, `$0 MXN`, degradación explícita.

### A-004 — P1: procedencia insuficientemente estructurada

`QuoteResponse` y `VyraInsightResponse` exponen campos `source` como texto libre, pero no existe un contrato estable para estados constitucionales como `SIMULATED`, `EXTERNAL_CURRENT`, `HYPOTHETICAL` o `UNAVAILABLE`.

Constitución relacionada: Seguridad, veracidad y separación entre simulación y realidad; Proveniencia y trazabilidad.

### A-005 — P1: valores visuales hardcodeados en Before Selling

La intervención muestra `−28%`, `Alta` y `$1,000` en la vista. Esos valores deben proceder del escenario y la cotización que devuelve el sistema, no de una copia visual independiente.

Constitución relacionada: Fuente de verdad, integridad de datos y no presentar cifras incorrectas.

### A-006 — P2: validación offline y accesibilidad incompleta

Existen tests unitarios y de componentes, pero falta evidencia reproducible del hero flow completo sin Internet y una revisión manual del diálogo `Before Selling` con teclado, foco, lector de pantalla y móvil.

## Decisión de auditoría

No se deben cerrar `T001–T009` como completamente conformes. Las brechas A-001 a A-005 deben convertirse en tareas concretas antes de implementar nuevas funcionalidades. A-006 requiere evidencia de validación antes del cierre de la Alpha.

## Próximo paso permitido por SDD

Actualizar `tasks.md` con tareas correctivas derivadas de estos hallazgos y aprobarlas antes de implementar. No se autoriza todavía una feature nueva.
