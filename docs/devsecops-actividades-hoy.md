# Bloque 5 — actividades de hoy

Responsable: DevSecOps (`Borre4023`). Objetivo: asegurar una base verificable sin retrasar la demo ni implementar herramientas que todavía no tienen un entorno de ejecución.

## Ya incorporado por el proyecto

- CodeQL para C# y JavaScript/TypeScript en cada PR y semanalmente.
- Permisos mínimos de Actions (`contents: read`).
- Concurrencia para cancelar ejecuciones obsoletas.
- Auditoría de paquetes .NET y npm en el job `dependency-audit`.
- Documento de prioridades en `docs/devsecops-roadmap.md`.

## Tareas de hoy

1. Ejecutar el nuevo job de auditoría en el PR de prueba y registrar cualquier vulnerabilidad real.
2. Revisar `ci.yml` y `codeql.yml` para confirmar que ningún job use permisos mayores a los necesarios.
3. Comprobar que no existan secretos, tokens o cadenas de conexión en el repositorio; si aparece uno, revocarlo y moverlo a secretos de GitHub.
4. Proponer entre 8 y 16 reglas Semgrep para C# y TypeScript, empezando en modo informativo para medir falsos positivos.
5. Revisar las alertas de CodeQL y clasificar: corregir ahora, aceptar con justificación o crear seguimiento.
6. Preparar un resumen de endurecimiento con estado, evidencia y pendientes P1/P2.

## No hacer hoy

No añadir RESTler, ZAP, Stryker, Testcontainers, Trivy, Cosign ni chaos engineering hasta disponer de contenedor, entorno efímero, base de datos de prueba o registro de imágenes. No cambiar el flujo de demo ni introducir bloqueos por advertencias no explotables.

## Terminado cuando

- El job `dependency-audit` termina correctamente o deja vulnerabilidades registradas con responsable.
- CodeQL no tiene hallazgos críticos sin tratar.
- No hay secretos expuestos.
- Existe una propuesta de Semgrep y un informe breve de endurecimiento.
