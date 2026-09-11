# VyraAI Insight v0.1

VyraAI v0.1 es un motor educativo explicable. Combina una cotización obtenida por el servidor, el pulso provisional, el entorno y la exposición virtual para devolver contexto y preguntas de reflexión.

No predice precios, no diagnostica estados emocionales y no produce instrucciones de compra o venta.

## Endpoint

`POST /api/guide/insights`

```json
{
  "symbol": "BTC",
  "intendedAction": "sell",
  "environment": "sandbox",
  "scenario": "crash",
  "profile": {
    "experience": "beginner",
    "riskDisposition": "medium",
    "horizon": "long",
    "objective": "growth",
    "pressureResponse": "pauseAndReview",
    "assessmentVersion": "pulse-v1"
  },
  "virtualExposurePercent": 10
}
```

Valores admitidos:

- `intendedAction`: `explore`, `buy`, `hold`, `sell`.
- `environment`: `market`, `sandbox`.
- `scenario`: `baseline`, `crash`. Mercado únicamente admite `baseline`.
- `virtualExposurePercent`: número entre 0 y 100.

## Trazabilidad

Cada respuesta incluye:

- factores con códigos estables;
- preguntas de reflexión;
- señales de conducta observables, no diagnósticos;
- `source: vyra-rules-v0.1`;
- procedencia de la cotización en `marketSource`;
- fecha UTC y descargo educativo.

Para `environment: market`, el servidor consulta el proveedor de mercado y no confía en un precio enviado por el navegador. Para `environment: sandbox` con `scenario: crash`, aplica el escenario determinista sin contaminar las cotizaciones reales.

## Evolución prevista

Un narrador generativo podrá añadirse detrás de una interfaz opcional. El motor de reglas seguirá siendo la fuente de hechos; si el narrador no está configurado o falla, la respuesta local continuará disponible.
