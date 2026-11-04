# Contribuir a Nuvyra

Trabajamos con ramas breves y pull requests pequeños; `main` debe estar siempre demostrable.

## Preparación

1. Clona el repositorio y abre `Nuvyra.slnx` en Visual Studio Community.
2. Crea tu rama desde `main` actualizado.
3. No agregues secretos, tokens, credenciales ni archivos `.env` reales.
4. Lee `AGENTS.md`, la Constitution y la spec, plan y tasks relevantes.
5. Ejecuta compilación y verificaciones antes de abrir un pull request.

## Flujo SDD obligatorio

Para una funcionalidad significativa, el trabajo sigue:

`Spec → Clarification → Human Approval → Plan → Human Approval → Tasks → Implementation → Tests → Validation → PR`

Durante Clarification no se escribe código. Las preguntas que puedan cambiar comportamiento financiero, privacidad, seguridad o alcance deben resolverse antes del plan. Consulta [`docs/specs/README.md`](docs/specs/README.md) y no implementes nada fuera de una spec aprobada.

November Alpha es el límite rector: trabajo local, offline-capable, `$0 MXN`, datos virtuales y sin servicios externos obligatorios.

```powershell
git switch main
git pull --ff-only
git switch -c feat/nombre-breve
dotnet build Nuvyra.slnx
dotnet run --project tests/Nuvyra.UnitTests
```

## Ramas

- `feat/...`: funcionalidad nueva.
- `fix/...`: corrección.
- `docs/...`: documentación.
- `chore/...`: mantenimiento o infraestructura.
- `spike/...`: experimento desechable; no se integra sin convertirlo en implementación limpia.

Ejemplos: `feat/risk-assessment`, `feat/responsive-dashboard`, `fix/portfolio-rounding`.

## Commits y pull requests

Usamos Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:` y `ci:`. Un PR debe resolver una tarea concreta, explicar cómo probarla y evitar cambios ajenos. Prefiere **Squash and merge** para mantener un historial lineal.

Se requiere al menos una revisión. Quien escribió el cambio no lo aprueba. Los cambios de dominio financiero, seguridad o persistencia requieren revisión del responsable de esa área.

## Límites de arquitectura

- `Domain` no conoce HTTP, bases de datos, proveedores ni IA.
- `Application` coordina casos de uso.
- `Infrastructure` implementa persistencia e integraciones.
- `Api` traduce HTTP; no contiene reglas financieras.
- `Contracts` contiene mensajes públicos sin comportamiento.
- La web consume la API; nunca duplica reglas financieras críticas.

Una nueva base de datos, servicio externo, paquete de IA o microservicio requiere una decisión en `docs/architecture/decisions`.

## Definición de terminado

- Compila sin advertencias en CI.
- Tiene una verificación proporcional al cambio.
- No contiene secretos ni datos personales.
- Mantiene la experiencia móvil y de escritorio.
- Los mensajes financieros son educativos, explicables y no prometen resultados.
- El PR incluye capturas cuando modifica interfaz.
