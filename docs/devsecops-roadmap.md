# Hoja de ruta DevSecOps

Esta matriz documenta el objetivo de seguridad sin convertir cada control en requisito inmediato del MVP. El responsable del bloque 5 decide las herramientas, versiones y umbrales finales.

| Prioridad | Control | Herramienta sugerida | Estado/alcance |
| --- | --- | --- | --- |
| P0 | Análisis de código C# y TypeScript | CodeQL (ya configurado) | Obligatorio en PR; corregir hallazgos altos |
| P0 | Dependencias vulnerables y SBOM | `dotnet list package --vulnerable`, npm audit, CycloneDX | Añadir al CI sin bloquear por avisos no explotables |
| P0 | Secretos y permisos | Secret scanning, permisos mínimos de Actions | Revisar antes de la presentación |
| P1 | SAST rápido | Semgrep con reglas pequeñas | Ejecutar en PR; ajustar falsos positivos |
| P1 | Calidad C# | SonarAnalyzer o analyzers .NET | Introducir cuando el umbral esté acordado |
| P1 | Escaneo de contenedores | Trivy + Docker Scout | Solo cuando exista Dockerfile desplegable |
| P1 | DAST | OWASP ZAP | Contra entorno efímero, nunca producción |
| P2 | Fuzzing y mutation testing | RESTler, Stryker.NET | Después de estabilizar contratos y cobertura |
| P2 | Pruebas de base de datos | Testcontainers | Cuando se incorpore PostgreSQL |
| P2 | Chaos engineering | Docker + PowerShell | Entorno nocturno, fuera del flujo de PR |
| P2 | Firmado de imágenes | Cosign/OIDC | Requiere pipeline de imágenes y registro |

## Base mínima para esta semana

DevSecOps puede concentrarse en CodeQL, auditoría de dependencias, detección de secretos, permisos mínimos y un informe de endurecimiento. Semgrep puede añadirse como control ligero si no retrasa la demo.

RESTler, ZAP, Stryker, Testcontainers, Trivy, Cosign y chaos engineering quedan documentados como P1/P2: son valiosos, pero no deben introducirse sin un entorno y un responsable claros.

Los jobs deben fallar solo por vulnerabilidades o regresiones que el equipo haya definido como bloqueantes. Toda herramienta debe fijar su versión o action major y publicar resultados legibles en el PR.
