# Flujo de trabajo del equipo

## Modelo de ramas

`main` es la única rama permanente y siempre debe poder presentarse. Cada tarea vive en una rama corta, idealmente menos de dos días, y entra mediante pull request con **Squash and merge**.

```text
main ──●────────●────────●── versión presentable
        ╲      ╱ ╲      ╱
       feat/ui   feat/profile
```

No usamos `develop`: con cuatro personas duplicaría integraciones y aumentaría conflictos. Para trabajo incompleto se usan feature flags, datos simulados o una rama `spike/...` que no se integra directamente.

## Reparto inicial sin bloqueos

| Frente | Carpetas principales | Evitar modificar |
|---|---|---|
| Experiencia web | `apps/web` | Reglas del dominio |
| Dominio y conducta | `src/Nuvyra.Domain`, `src/Nuvyra.Application`, `tests` | Integraciones y UI |
| API y datos | `src/Nuvyra.Api`, `src/Nuvyra.Infrastructure` | Estilos y reglas internas del dominio |
| Producto, contenido y QA | `docs`, issues, criterios, pruebas exploratorias | Cambios amplios sin issue |

El reparto es propiedad de revisión, no una prohibición: cualquiera puede colaborar, pero avisa en el issue antes de tocar un archivo que otra persona está modificando.

## Ciclo diario

1. Elegir o crear un issue pequeño y asignarse.
2. Publicar una rama con el número del issue: `feat/12-risk-profile`.
3. Abrir PR en borrador temprano para hacer visible el trabajo.
4. Actualizar desde `main` antes de solicitar revisión.
5. Una persona revisa; el autor corrige; CI debe quedar verde.
6. Squash, eliminar rama y comprobar la demo.

## Protección que debe activarse en GitHub

En **Settings → Rules → Rulesets**, crear `Protect main` para `main`:

- Require a pull request before merging.
- Require 1 approval y dismiss stale approvals.
- Require approval of the most recent push.
- Require status checks: `Backend · build and checks` y `Web · typecheck and build`.
- Require conversation resolution y linear history.
- Block force pushes y branch deletion.
- No bypass para colaboradores; administrador solo para emergencias.

En **Settings → Security** habilitar Dependabot alerts, dependency graph, secret scanning, push protection y private vulnerability reporting. CodeQL se iniciará con el workflow incluido si el plan del repositorio lo permite.

## Conflictos

Integra `main` en tu rama mediante rebase antes del PR final y resuelve los conflictos en tu propia rama. Si dos tareas requieren el mismo archivo central, acuerden primero el contrato y entreguen en orden; no desarrollen dos versiones paralelas del mismo modelo.
