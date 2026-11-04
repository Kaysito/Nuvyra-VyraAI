# Memoria operativa SDD

Esta carpeta conserva contexto útil entre sesiones de trabajo. Su propósito es evitar repetir análisis y ayudar a agentes y humanos a recuperar decisiones, avances, hallazgos y aprendizajes.

## Autoridad

La memoria es documentación derivada y contextual. No puede sustituir ni contradecir:

`Constitution → spec aprobada → ADR → plan → tasks → implementación → tests`

Si una memoria contradice una fuente superior, se corrige o se marca como obsoleta; no se usa para justificar una implementación.

## Registro automático de continuidad

Cada vez que el Product Owner indique continuar una tarea, se debe añadir una entrada a [`progress.md`](./progress.md) con:

- fecha;
- spec y tarea activa;
- avance realizado;
- decisiones tomadas;
- aprendizaje o hallazgo relevante;
- validaciones ejecutadas;
- commit relacionado, si existe;
- siguiente paso permitido por SDD.

## Uso por agentes

Antes de trabajar, el agente debe consultar el registro relevante después de leer `AGENTS.md`, la Constitution y los documentos de la tarea. La memoria sirve para recuperar contexto, no para saltarse la inspección del código actual.

## Higiene

- No guardar secretos, tokens, credenciales ni datos personales.
- No copiar logs extensos ni conversaciones completas.
- Preferir resúmenes breves y enlaces a la fuente canónica.
- Marcar como `Obsoleto` cualquier entrada superada por una decisión posterior.
