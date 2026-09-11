# Antes de vender v0.2

`POST /api/decisions/before-sell` recibe el símbolo de una posición existente en el sandbox.

La respuesta ya no expone una puntuación de urgencia. Incluye:

- pérdida o ganancia porcentual observada;
- señales factuales como `sharpDrop`, `positionAtLoss` y `fullLiquidationIntent`;
- tres escenarios deterministas: `sellAll`, `sellHalf` y `hold`;
- efectivo liberado, exposición restante y resultado reconocido;
- alternativas educativas que nunca impiden continuar.

Los cálculos utilizan la posición y la cotización simuladas en el servidor. No representan una proyección ni una recomendación de inversión.
