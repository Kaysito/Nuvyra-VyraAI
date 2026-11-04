# SPEC-000 — Nuvyra November Alpha

Status: Clarification
Priority: Critical
Owner: Product + Architecture
Target: November Alpha

## Context

Nuvyra ya cuenta con un monolito modular, una demo con datos virtuales, educación financiera, Vyra y una experiencia inicial de Before Selling. Esta spec delimita la primera experiencia end-to-end demostrable sin convertir el alcance en una reconstrucción del producto.

## Problem

El equipo necesita un alcance verificable y común para construir la Alpha sin introducir servicios obligatorios, funcionalidades no aprobadas o reglas financieras fuera de la arquitectura existente.

## Goal

Entregar antes del 30 de noviembre de 2026 una experiencia local, offline-capable y de `$0 MXN` que conecte Learn, Invest y Vyra mediante una intervención explicable antes de vender.

## Non-Goals

- dinero real, brokerage, KYC, depósitos o retiros;
- PostgreSQL obligatorio para ejecutar la demo;
- APIs financieras pagadas, cloud, Redis, microservicios o Kubernetes;
- ML de producción o asesoría financiera regulada;
- diagnósticos psicológicos;
- funcionalidades no descritas y aprobadas mediante una spec.

## User Stories

- Como usuario, quiero aprender un concepto financiero breve antes de practicar.
- Como usuario, quiero operar con dinero virtual dentro de un sandbox.
- Como usuario, quiero observar una caída simulada y revisar contexto antes de vender.
- Como usuario, quiero comparar vender todo, vender parcialmente o mantener sin recibir una predicción presentada como certeza.
- Como usuario, quiero conservar la decisión final y registrar lo que aprendí.

## Functional Requirements

- `REQ-ALPHA-001` — El sistema SHALL permitir ejecutar el flujo principal localmente sin Internet después de instalar las dependencias.
- `REQ-ALPHA-002` — El sistema SHALL usar únicamente dinero y posiciones virtuales durante la demo.
- `REQ-ALPHA-003` — WHEN una caída simulada activa Before Selling, THE SYSTEM SHALL mostrar contexto y escenarios deterministas sin bloquear la venta.
- `REQ-ALPHA-004` — El sistema SHALL mantener las reglas financieras y conductuales en el dominio o servicios deterministas existentes, no en React ni en un modelo generativo.
- `REQ-ALPHA-005` — El sistema SHALL comunicar señales observables sin diagnosticar emociones o estados psicológicos.
- `REQ-ALPHA-006` — El sistema SHALL funcionar sin infraestructura o API comercial obligatoria y con un presupuesto de `$0 MXN`.

## Business Rules

- El usuario conserva la decisión final.
- Las alternativas son escenarios virtuales, no pronósticos.
- Vyra explica señales calculadas; no inventa datos ni altera el portafolio.
- VyraPoints, si participa, reconoce aprendizaje y reflexión, no rentabilidad ni frecuencia de operaciones.

## EARS Requirements

- `REQ-ALPHA-001`: **WHILE** the demo is running locally, **THE SYSTEM SHALL** execute the central scenario without an Internet connection.
- `REQ-ALPHA-003`: **WHEN** the user initiates a sale after the simulated drop, **THE SYSTEM SHALL** present Before Selling and allow the user to continue.
- `REQ-ALPHA-005`: **IF** a behavioral signal is shown, **THEN** the system SHALL describe observable evidence rather than an inferred psychological state.

## Inputs

Datos virtuales del sandbox, respuestas del pulso existente, posición simulada, evento de caída y elección explícita del usuario.

## Outputs

Contexto explicable, tres escenarios deterministas, acciones educativas y registro de la decisión virtual.

## Domain Concepts

Sandbox, posición virtual, evento de mercado simulado, señal observable, intervención Before Selling, escenario determinista y decisión del usuario.

## UI / UX Behavior

La intervención debe ser clara, educativa y no bloqueante. Debe permitir revisar evidencia, esperar o continuar con la venta.

## Error / Failure States

- Datos incompletos: mostrar un estado recuperable y no inventar valores.
- Operación inválida: rechazarla sin mutar el portafolio.
- Dependencia externa no disponible: la demo central debe continuar con datos locales o simulados.

## Security Considerations

No incluir secretos, tokens ni credenciales. No tratar datos virtuales como cuentas reales.

## Privacy Considerations

Recolectar solo datos necesarios para la demo y no persistir datos personales innecesarios.

## AI Considerations

La IA es opcional para la demo y nunca es fuente de verdad. La Alpha debe poder demostrarse sin una API generativa comercial.

## Edge Cases

- usuario cancela o continúa la venta;
- venta parcial y liquidación total;
- caída sin posición existente;
- reinicio del proceso y restauración del sandbox;
- ausencia de Internet;
- señales insuficientes para una intervención.

## Acceptance Criteria

- El recorrido Learn → Invest → caída simulada → Before Selling → decisión → reflexión puede demostrarse localmente.
- La venta nunca queda bloqueada por la intervención.
- Los escenarios muestran cálculos deterministas y no predicciones.
- Los tests verifican las reglas críticas.
- La ejecución no requiere PostgreSQL, cloud ni servicios pagados.

## Out of Scope

Todo lo indicado en November Alpha como explícitamente no requerido, además de cualquier feature no trazada a esta spec.

## Open Questions

1. ¿Cuál es exactamente el guion mínimo de demo que se aprobará como recorrido oficial?
2. ¿La Alpha debe incluir autenticación local o la demo opera con un usuario provisional?
3. ¿Qué partes de la implementación actual de PostgreSQL/autenticación pertenecen a la Alpha y cuáles quedan fuera del recorrido offline?
4. ¿Qué criterios visuales mínimos deben aprobarse para considerar la experiencia “pulida”?

## Demo Scenario

1. Abrir la aplicación localmente sin Internet.
2. Completar o cargar el pulso provisional.
3. Revisar una microlección.
4. Comprar un activo con saldo virtual.
5. Simular una caída intensa.
6. Iniciar una venta y abrir Before Selling.
7. Revisar vender todo, vender parcialmente o mantener.
8. Continuar con la decisión elegida y registrar la reflexión.

## Traceability

La trazabilidad detallada se completará después de la fase Clarification y la aprobación humana del alcance.
