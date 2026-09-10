# Línea base DevSecOps

Esta línea base cubre los controles que deben pasar antes de integrar cambios:

| Control | Automatización | Criterio |
| --- | --- | --- |
| Build y pruebas .NET | `ci.yml` | Compilación Release y pruebas verdes |
| Build web | `ci.yml` | TypeScript/Vite sin errores |
| Dependencias NuGet | `security.yml` | Sin vulnerabilidades reportadas |
| Dependencias npm | `security.yml` | Sin vulnerabilidades altas o críticas |
| Secretos | `security.yml` + Gitleaks | Sin secretos detectados |
| Análisis estático | CodeQL | Alertas críticas revisadas |

La tabla de herramientas avanzada (Semgrep, ZAP, RESTler, Stryker, PactNet,
Testcontainers y caos) queda como backlog P1. Se incorporará cuando exista el
escenario que pueda probarla de forma reproducible; no se agregan herramientas
que vuelvan frágil la demo o generen falsos positivos.
