# Actividades del bloque 4 para hoy

Responsable: encargado de API, integración y datos de mercado.
Rama: `feat/api-and-market-integration`.
Tiempo recomendado: 4 horas. La meta es que frontend y dominio puedan integrarse mañana con contratos estables y datos locales reproducibles.

## 1. Preparar la rama (10 min)

Crear o cambiar a `feat/api-and-market-integration` desde `origin/main`, actualizar con `git pull --ff-only` y confirmar que no haya cambios propios sin guardar.

## 2. Auditar el contrato actual (30 min)

Revisar `Program.cs`, `Nuvyra.Contracts/ApiContracts.cs` e `INuvyraDemoService`. Hacer una tabla endpoint–request–response–errores. Detectar las capacidades que aún faltan o tienen nombres ambiguos: lección, venta, reinicio y estado completo del sandbox.

No cambiar nombres sin avisar al bloque 1 y al bloque 3. Si un endpoint ya existe, conservar su forma y documentar la decisión.

## 3. Publicar contratos mínimos (45 min)

Estabilizar DTOs para:

- Evaluar perfil.
- Obtener microlección.
- Consultar cotizaciones.
- Consultar portafolio.
- Comprar y vender virtualmente.
- Simular caída.
- Reiniciar demo.
- Solicitar intervención y registrar decisión.

Cada respuesta debe incluir identificador, estado, fecha UTC cuando corresponda, procedencia de cotización y un mensaje comprensible. Usar enums o valores documentados; no devolver `object` anónimo para contratos que frontend deba consumir.

## 4. Errores y validación (35 min)

Definir un formato único, por ejemplo `ProblemDetails` con `code`, `message`, `traceId` y errores de campos. Mapear cantidades inválidas, saldo insuficiente, posición inexistente y solicitudes mal formadas a códigos estables. No devolver stack traces ni detalles de secretos.

Validar JSON, límites, símbolo, cantidad y precio en la API; las invariantes financieras siguen viviendo en dominio. Confirmar que una petición rechazada no muta el sandbox.

## 5. Integrar el estado de demo (45 min)

Conectar la API al servicio de aplicación del bloque 3 sin duplicar cálculos. Exponer un estado inicial confiable con 10,000 USD y cotizaciones de BTC, ETH y SOL. Implementar o coordinar los endpoints de compra, venta, caída y reinicio. La caída debe ser determinista y reiniciar debe devolver exactamente el estado inicial.

Si el bloque 3 aún no terminó, crear un adaptador temporal con la misma interfaz y marcarlo explícitamente como simulado; reemplazarlo cuando llegue el dominio real.

## 6. Datos de mercado y resiliencia (25 min)

Usar datos simulados como fuente por defecto para la demo, con `asOf` y `source: demo`. Preparar una interfaz para un proveedor externo. CoinGecko queda como P1: si se implementa, debe ser solo lectura, tener timeout, no romper el flujo y usar fallback local cuando falle. No introducir claves en código ni logs.

## 7. CORS, salud y documentación (30 min)

- Restringir CORS a los orígenes de desarrollo configurados, sin `AllowAnyOrigin` junto con credenciales.
- Añadir endpoint de salud que indique aplicación y versión, sin secretos.
- Documentar ejemplos de request/response y errores en `docs/api` o en un README cercano a contratos.
- Añadir un ejemplo de recorrido offline: health → quotes → buy → crash → portfolio → reset.
- Preparar OpenAPI solo si no retrasa el contrato y la compilación.

## 8. Pruebas de integración (40 min)

Probar health, cotizaciones con procedencia, evaluación de perfil, compra válida, venta válida, saldo insuficiente, cantidad inválida, caída, reinicio y decisión de intervención. Comprobar códigos HTTP, JSON, `traceId`, CORS y que el fallback local funcione sin internet. Repetir reinicio dos veces para comprobar idempotencia.

## 9. Verificar y publicar (20 min)

Ejecutar `dotnet build Nuvyra.slnx --configuration Release`, `dotnet run --project tests/Nuvyra.UnitTests --configuration Release`, las pruebas de integración disponibles y `git diff --check`. Publicar con `git push -u origin feat/api-and-market-integration` y abrir un PR en borrador hacia `main`.

Usar commits pequeños, por ejemplo `feat(api): stabilize sandbox contracts`, `feat(api): add deterministic demo reset` y `test(api): cover offline journey`.

## Terminado hoy cuando

- Existe una tabla de contratos aprobada por los bloques 1 y 3.
- El recorrido offline funciona con datos simulados.
- Los errores tienen formato y códigos estables.
- CORS está restringido y existe health check.
- Compra, venta, caída y reinicio usan el servicio de dominio sin cálculos duplicados.
- Hay pruebas de respuestas correctas, errores y reinicio.
- La rama tiene un PR en borrador y pendientes P1 documentados.

## Fuera del alcance de hoy

Autenticación completa, órdenes reales, persistencia definitiva, Redis, análisis IA, streaming de precios y despliegue productivo. Esas decisiones requieren revisión de arquitectura y seguridad.
