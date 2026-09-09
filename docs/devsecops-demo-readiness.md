# Bloque 5 — DevSecOps y preparación de la demo

Esta matriz es la referencia técnica propuesta para Nuvyra. La primera columna de cada fase es el alcance mínimo que debe quedar ejecutándose antes de la presentación; la segunda puede prepararse como evolución del pipeline. No se deben incorporar herramientas que fallen por no tener un contenedor, una URL desplegada o un contrato estable.

## Prioridad para el viernes

| Prioridad | Control | Herramienta o criterio | Job sugerido | Evidencia |
| --- | --- | --- | --- | --- |
| P0 | Secretos | Gitleaks o escaneo equivalente | `security-baseline` | Log sin secretos y revisión de `.env` |
| P0 | Dependencias | `dotnet list package --vulnerable` y `npm audit --audit-level=high` | `dependency-audit` | Resultado guardado en el job |
| P0 | SAST | CodeQL ya configurado para C# y TypeScript; Semgrep puede añadirse como complemento | `codeql` / `semgrep-sast` | Alertas revisadas |
| P0 | Build y pruebas | `dotnet build`, pruebas unitarias y `npm run build` | `build-and-test` | CI verde |
| P0 | Configuración | CORS restringido, secretos fuera del repositorio, headers básicos, errores sin stack trace | `hardening-report` | Checklist firmado por el responsable |
| P0 | Revisión | Protección de `main`, PR obligatorio, CODEOWNERS y revisión de Dependabot | GitHub | Captura o enlace de configuración |

El pipeline actual ya ejecuta build backend, pruebas unitarias, build web y CodeQL. Antes de añadir más jobs, cambiar `npm install` por `npm ci` cuando el `package-lock.json` esté confirmado y revisar que los workflows sigan verdes.

## Matriz completa propuesta

| Fase | Herramienta | Job CI | Momento adecuado |
| --- | --- | --- | --- |
| SAST | Semgrep con reglas C# y TypeScript propias | `semgrep-sast` | P0 si el tiempo permite; si no, P1 |
| SAST | SonarCloud + SonarAnalyzer.CSharp | `sonarcloud` | P1; requiere organización y token |
| SCA/SBOM | `dotnet list package --vulnerable` + SBOM CycloneDX | `build-and-test` | SCA en P0; SBOM en P1 |
| SCA | Trivy para imágenes y filesystem | `docker-scan` | Cuando exista Dockerfile e imagen |
| Firma | Cosign con OIDC keyless | `docker-build` | P1; solo si se publican imágenes |
| Lint de contenedor | Dockle | `docker-scan` | P1; requiere imagen |
| DAST | RESTler | `restler-fuzz` | Posterior a contratos estables y entorno de prueba |
| DAST | OWASP ZAP baseline | `zap-dast` | P1 si existe URL local desplegable |
| Mutation testing | Stryker.NET con umbral 60 % | `mutation-test` | Después de tener reglas de dominio estables |
| Contratos | PactNet 5.0.1 o pruebas de contrato equivalentes | `contract-test` | Cuando API y frontend compartan contratos |
| Migraciones DB | Testcontainers MSSQL o proveedor acordado | `database-test` | Cuando haya migraciones reales |
| Chaos engineering | PowerShell + Docker + NBomber | `chaos-nightly.yml` | Fuera del camino crítico de la demo |
| Quality gate | Script que resume builds, seguridad y pruebas | `hardening-report` | P0 |

La nota original menciona ISO/IEC 27034 y OWASP. Para esta entrega se usan como referencias de diseño y revisión; no se debe afirmar certificación ni cumplimiento formal sin un alcance, evidencias y auditoría definidos.

## Criterios de seguridad

- No guardar tokens de GitHub, CoinGecko, SonarCloud, Cosign ni proveedores de IA en el repositorio.
- No imprimir variables de entorno, cabeceras `Authorization` ni respuestas completas de proveedores en los logs.
- Usar permisos mínimos en cada workflow (`contents: read`; `security-events: write` solo donde sea necesario).
- Fijar versiones mayores de acciones y revisar Dependabot; no fusionar una actualización con CI rojo.
- Validar entrada y cantidades en el dominio; la UI nunca sustituye las reglas del backend.
- Sanitizar mensajes de error y evitar stack traces en respuestas HTTP.
- Si se añade ZAP o RESTler, apuntarlo solo al entorno local o de prueba de Nuvyra, nunca a un servicio de terceros.
- Tratar los datos de mercado como externos y no confiables; registrar procedencia y fecha.

## Terminado para hoy

El responsable de DevSecOps debe entregar:

1. CI backend y web verde en su rama.
2. CodeQL revisado y un escaneo de secretos/dependencias documentado.
3. Checklist de hardening con hallazgos clasificados: bloqueante, alto, medio o bajo.
4. Comprobación de protección de `main`, CODEOWNERS y plantillas de PR.
5. Una nota indicando qué controles de la matriz completa quedan para P1 y por qué.

La meta del viernes es una demo reproducible, con riesgos visibles y decisiones justificadas; una lista extensa de herramientas sin ejecución verificable no cuenta como control implementado.
