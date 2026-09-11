# Cotizaciones de mercado en Nuvyra

`GET /api/market/quotes` consulta BTC, ETH y SOL mediante CoinGecko. Es una fuente de solo lectura y está separada del proveedor determinista utilizado por el sandbox.

## Estados de procedencia

- `coingecko`: respuesta reciente del proveedor externo.
- `coingecko-cache`: última respuesta válida conservada cuando una actualización falla.
- `demo-fallback`: valores locales de referencia cuando todavía no existe una respuesta externa válida.

Todas las respuestas incluyen `asOf`. La interfaz muestra la procedencia y nunca presenta el fallback como información en vivo.

## Resiliencia

- Timeout predeterminado: 3 segundos.
- Caché en memoria predeterminada: 30 segundos.
- La vista Mercado solicita una actualización cada 30 segundos mientras permanece abierta.
- Un fallo de red, límite del proveedor o respuesta inválida no interrumpe la demo.
- La simulación de caída solo modifica el proveedor del sandbox; nunca modifica Mercado.

## Configuración

Los valores no sensibles están en `src/Nuvyra.Api/appsettings.json`. Una clave opcional de CoinGecko Demo puede establecerse sin guardarla en el repositorio:

```text
MarketData__CoinGecko__ApiKey=<clave>
```

La integración pública funciona sin clave. Para un despliegue real se debe usar gestión de secretos y revisar el plan, límites y licencia del proveedor.

## Recorrido de comprobación

1. Iniciar `Nuvyra.Api`.
2. Consultar `GET /api/market/quotes`.
3. Confirmar tres activos, `source` y `asOf`.
4. Desconectar internet o configurar temporalmente una URL no disponible.
5. Confirmar que el endpoint responde y que la UI identifica caché o datos demo.
6. Ejecutar una caída en Práctica y confirmar que los precios de Mercado permanecen independientes.
