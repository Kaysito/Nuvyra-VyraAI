# Guía de agentes para Nuvyra

## Lectura obligatoria

Antes de modificar código, el agente debe leer, en este orden:

1. Este archivo.
2. `docs/constitution/constitution.md`.
3. La especificación relevante en `docs/specs/`.
4. El plan relevante.
5. Las tareas relevantes.
6. `CONTRIBUTING.md`, `docs/team-workflow.md` y la documentación de arquitectura relacionada.
7. El código y los tests existentes afectados.

## Reglas de trabajo

- La Constitution es la autoridad normativa superior del repositorio; ninguna spec, ADR, plan, tarea, implementación o documentación puede contradecirla.
- Entender antes de modificar.
- Hacer el cambio mínimo necesario.
- No implementar requisitos inexistentes ni inventar reglas de negocio.
- No hacer refactors no solicitados ni introducir dependencias innecesarias.
- Respetar el monolito modular y los límites de `Domain`, `Application`, `Infrastructure`, `Contracts` y `Api`.
- No introducir servicios de pago, proveedores externos obligatorios o infraestructura cloud para November Alpha.
- Mantener los tests existentes funcionando y añadir pruebas cuando el requisito lo necesite.
- Mantener sincronizados especificación, plan, tareas, código y tests.
- Mantener `main` demostrable.

Si una ambigüedad puede cambiar el comportamiento del producto, una regla financiera, la privacidad o la seguridad: **STOP AND CLARIFY**. No adivinar.

## November Alpha

November Alpha es el límite rector del trabajo actual:

- fecha objetivo: 30 de noviembre de 2026;
- presupuesto obligatorio: `$0 MXN` para infraestructura y servicios;
- entorno local;
- flujo central demostrable sin Internet;
- datos virtuales y simulados, nunca dinero real;
- sin brokerage, KYC, depósitos, retiros ni asesoría financiera regulada;
- sin PostgreSQL obligatorio, cloud, microservicios, Kubernetes o ML de producción;
- conservar la arquitectura actual salvo decisión explícita y aprobada.

## Flujo obligatorio

`Idea → Spec → Clarification → Human Approval → Plan → Human Approval → Tasks → Implementation → Tests → Validation → Spec ↔ Code Review → PR → main`

No se genera código durante Clarification. Toda funcionalidad significativa debe tener una spec con requisitos identificados y una tabla de trazabilidad.
