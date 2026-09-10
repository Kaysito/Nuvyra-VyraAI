# Orden de trabajo para mañana

## Objetivo

Avanzar en paralelo sin trabajar sobre contratos o ramas obsoletas. La rama `main` es la única referencia de integración.

## Regla de inicio obligatoria (primeros 15 minutos)

Cada participante debe:

1. Actualizar referencias remotas y partir de `origin/main`.
2. Crear una rama nueva para un único issue; no reutilizar ramas antiguas.
3. Revisar los PR abiertos, sus checks y los archivos modificados.
4. Anotar en el issue el commit base utilizado y los archivos que tocará.
5. Detenerse y avisar si el contrato local difiere de `main`.

No se permite trabajar varios días sobre una rama sin sincronizarla. Antes de continuar después de una pausa, hay que actualizarla con los cambios recientes de `main` y resolver conflictos de inmediato.

## Orden de dependencias

1. **Bloque 5 — DevSecOps:** comprobar que la compilación, pruebas y análisis existentes estén verdes; documentar cualquier herramienta que quede como P1.
2. **Bloque 2 — Aprendizaje y perfil:** cerrar preguntas, opciones y contenidos de `pulse-v1`; no introducir `clarity`, score global ni `BehavioralRiskScore`.
3. **Bloque 3 — Dominio/sandbox:** mantener las invariantes financieras y el recorrido determinista offline; publicar cambios de dominio antes de pedir integración.
4. **Bloque 4 — API/datos:** consumir el dominio mediante sus interfaces, respetar DTOs y códigos de error; no duplicar cálculos en controladores.
5. **Bloque 1 — Frontend:** integrar únicamente después de confirmar los contratos publicados por los bloques 2–4. El frontend no inventa propiedades ni endpoints.

Si un bloque necesita una decisión de otro, abrir un comentario en el issue y esperar confirmación; no crear un contrato alternativo “temporal” sin dejarlo marcado y aprobado.

## Contratos congelados para la sesión

- `pulse-v1` devuelve cinco dimensiones independientes: `experience`, `riskDisposition`, `horizon`, `objective` y `pressureResponse`.
- El perfil es provisional y lleva `assessmentVersion = "pulse-v1"`.
- No hay suma global, `clarity`, `score` ni `BehavioralRiskScore` en el flujo nuevo.
- Cotizaciones incluyen `source` y `asOf`.
- El sandbox usa datos demo reproducibles y reinicio idempotente.

Cualquier cambio de nombre, tipo, endpoint o semántica requiere comentario en el PR y aprobación de los responsables de bloques afectados.

## Reglas de ramas y PR

- Una rama por issue, con prefijo `feat/`, `fix/`, `test/` o `docs/`.
- Commits pequeños y descriptivos; no mezclar limpieza general con funcionalidad.
- Nunca hacer push directo a `main`.
- Abrir PR en borrador al tener una primera pieza revisable; convertirlo a listo solo con pruebas verdes.
- Antes de solicitar revisión: sincronizar con `origin/main`, ejecutar build, pruebas y `git diff --check`, y escribir el recorrido validado.
- El autor no integra su propio PR si existe un revisor disponible; los conflictos se resuelven en la rama del autor.

## Handoff mínimo entre bloques

El comentario final del issue debe incluir:

- commit base y commit final;
- archivos y contratos modificados;
- endpoints, propiedades y códigos de error afectados;
- comandos de verificación y resultado;
- decisiones pendientes, riesgos y trabajo P1;
- instrucciones exactas para que el siguiente bloque pueda probarlo offline.

## Puntos de coordinación

- **Inicio:** cada responsable confirma rama, issue, base SHA y dependencia bloqueante.
- **Mitad de jornada:** se revisan PR, checks y cambios de contrato; si aparece una divergencia, se congela la integración hasta resolverla.
- **Cierre:** cada responsable deja handoff en su issue y enlaza el PR. Solo se planifica el siguiente bloque cuando el anterior tiene contrato y pruebas verificables.

Este orden permite colaborar en paralelo, pero mantiene una única fuente de verdad y evita que un cambio desactualizado sobrescriba el trabajo de otro compañero.
