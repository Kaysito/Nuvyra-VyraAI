# Specs de Nuvyra

Una spec describe qué debe hacer el sistema; el plan describe cómo integrarlo; las tareas dividen el trabajo verificable.

## Flujo

`Spec → Clarification → Human Approval → Plan → Human Approval → Tasks → Implementation → Tests → Validation → PR`

Durante **Clarification** se revisan ambigüedades, contradicciones, requisitos no verificables, edge cases, estados de fallo, seguridad, privacidad y conflictos con la Constitution. No se genera código durante esa fase.

## Convenciones

- Features: `SPEC-[ID]`, por ejemplo `SPEC-000`.
- Requisitos: `REQ-[FEATURE]-001`, por ejemplo `REQ-BS-001`.
- Tareas: `T001`, `T002`, etc.
- La spec, plan y tasks viven en una carpeta con el mismo ID.
- Cada spec aprobada debe incluir una tabla `Requirement → Plan → Task → Implementation → Test`.

Una funcionalidad sencilla debe tener documentación sencilla. No se crean documentos por burocracia.

## Orden inicial

`SPEC-000` debe definir el alcance verificable de November Alpha antes de iniciar nuevas features.

## Plantillas

- [`spec.md`](./_template/spec.md)
- [`plan.md`](./_template/plan.md)
- [`tasks.md`](./_template/tasks.md)
