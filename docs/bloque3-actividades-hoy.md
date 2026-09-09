# Actividades del bloque 3 para hoy

Responsable: compañero de sandbox y dominio financiero. Rama: `feat/financial-sandbox`. Tiempo recomendado: 4 horas.

La meta es dejar un núcleo determinista que la API pueda consumir mañana y que soporte la demo sin depender de CoinGecko ni de React.

## 1. Preparar la rama (10 min)

Usar `git fetch origin`, crear o cambiar a `feat/financial-sandbox` desde `origin/main`, actualizar con `git pull --ff-only` y confirmar `git status`.

## 2. Definir reglas (25 min)

- Moneda base: USD y saldo inicial: 10,000.00.
- Cantidad y precio siempre positivos.
- Usar `decimal`, nunca `double`, para importes.
- Dinero a 2 decimales y cantidad a 8, o documentar otra decisión.
- Cada orden tiene identificador y fecha UTC.
- La caída usa un factor fijo y reproducible, por ejemplo `-28 %`.
- El dominio no depende de React, HTTP ni proveedores externos.

Si el equipo decide otros valores, actualizar la nota y comunicarlo al bloque 4 antes de cambiar contratos.

## 3. Separar modelos (45 min)

Crear archivos para `VirtualPortfolio`, `Position`, `VirtualOrder`, `MarketQuote`, `InvestorProfile` y `DecisionIntervention`. Coordinar `InvestorProfile` con el bloque 2.

Aplicar invariantes: símbolos no vacíos, cantidades mayores que cero, precios no negativos y saldo que nunca queda negativo.

## 4. Implementar operaciones virtuales (60 min)

Implementar compra con saldo suficiente, venta limitada a la posición, precio promedio tras varias compras, valor actual, rendimiento, identificador de orden y errores de dominio estables. Rechazar cero, negativos, NaN, infinito, saldo insuficiente y venta superior a la posición. Toda operación rechazada debe dejar el estado intacto.

## 5. Escenario, caída y reinicio (35 min)

Crear estado inicial fijo con BTC, ETH y SOL; aplicar una caída fija sin azar; recalcular valor y pérdida; y hacer que reiniciar restaure saldo, posiciones, órdenes y cotizaciones. La caída y el reinicio deben poder repetirse sin acumular efectos.

## 6. Pruebas de dominio (60 min)

Cubrir compra, venta parcial y total, precio promedio, saldo insuficiente, cantidades y precios inválidos, venta superior a la posición, precisión, caída exacta del 28 %, rendimiento, reinicio idempotente, rechazo sin mutación y repetición determinista. Usar nombres de prueba que describan la regla, por ejemplo `Buy_WhenBalanceIsInsufficient_DoesNotMutatePortfolio`.

## 7. Fixture y coordinación (25 min)

Preparar una fábrica de demo con 10,000 USD y tres cotizaciones. Documentar cómo la API podrá crear, reiniciar y consultar el estado. Comunicar al bloque 4 los nombres de métodos, DTOs y contratos; no cambiar endpoints sin acuerdo.

## 8. Verificar y publicar (20 min)

Ejecutar `dotnet build Nuvyra.slnx --configuration Release`, las pruebas del proyecto `tests/Nuvyra.UnitTests`, `git diff --check` y `git status`. Publicar la rama con `git push -u origin feat/financial-sandbox` y abrir un PR en borrador hacia `main`.

Usar commits pequeños: `feat(domain): add virtual portfolio`, `test(domain): cover order invariants` y `feat(demo): add deterministic crash scenario`.

## Terminado hoy cuando

- Los modelos están separados y no hay cálculos financieros críticos en React.
- Comprar y vender conservan saldo y posiciones coherentes.
- Ninguna entrada inválida muta el estado.
- La caída produce exactamente el porcentaje esperado.
- Reiniciar restaura exactamente el estado inicial.
- Las pruebas cubren reglas y casos límite.
- Existe fixture de demo y PR en borrador.

## Fuera del alcance de hoy

CoinGecko, persistencia, autenticación, órdenes reales, recomendaciones de inversión y escenarios aleatorios. Esas piezas requieren API, infraestructura y revisión de seguridad.
