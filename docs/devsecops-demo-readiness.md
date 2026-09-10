# Demo readiness y controles DevSecOps

## Controles activos

- CI ejecuta build y pruebas de backend en Release.
- CI instala dependencias web sin scripts y ejecuta build TypeScript/Vite.
- CodeQL analiza C# y JavaScript/TypeScript en PR y en `main`.
- Dependabot mantiene acciones y dependencias mediante PR revisables.
- `main` debe integrarse únicamente mediante PR con checks verdes.
- No se almacenan secretos, claves ni datos financieros reales.

## Verificación previa al viernes

1. Ejecutar `dotnet build Nuvyra.slnx --configuration Release`.
2. Ejecutar las pruebas de dominio y revisar que no haya warnings.
3. Ejecutar `npm ci`, `npm run test:run`, `npm run test:coverage` y `npm run build` dentro de `apps/web`.
4. Ejecutar `git diff --check`.
5. Probar el recorrido de `docs/qa-matrix.md` tres veces consecutivas, incluida una corrida sin internet.
6. Confirmar que los PR abiertos tienen CI y CodeQL verdes antes de integrar.
7. Revisar Dependabot; no fusionar actualizaciones que cambien runtime o contratos durante el congelamiento.

## Evidencia y respuesta

El responsable de QA conserva capturas, resultados y el commit probado. Un fallo bloqueante se registra como issue y detiene la presentación hasta tener corrección o plan de contingencia. Un fallo alto requiere responsable y decisión antes del congelamiento del jueves por la tarde.

## Fuera de alcance del demo

No habilitar autenticación real, órdenes reales, persistencia productiva ni proveedores externos como requisito para la presentación. El sandbox sigue usando datos simulados y el lenguaje debe dejar claro que no es una promesa de rendimiento.
