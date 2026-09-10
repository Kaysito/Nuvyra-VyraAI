# Contrato conceptual `pulse-v1`

El Pulso inicial es una lectura educativa y provisional. No diagnostica la personalidad ni determina la capacidad financiera real del usuario. Cada respuesta representa una dimensión independiente; no se suman en una puntuación global.

## Dimensiones y códigos

| Dimensión | Códigos |
| --- | --- |
| `experience` | `beginner`, `intermediate`, `advanced` |
| `riskDisposition` | `conservative`, `moderate`, `aggressive` |
| `horizon` | `short`, `medium`, `long`, `unspecified` |
| `objective` | `preservation`, `growth`, `income`, `unspecified` |
| `pressureResponse` | `actNow`, `checkThenAct`, `pauseAndReview`, `unsure` |

## Ejemplo

```json
{
  "experience": "beginner",
  "riskDisposition": "moderate",
  "horizon": "long",
  "objective": "growth",
  "pressureResponse": "pauseAndReview"
}
```

La respuesta agrega `isProvisional: true`, `assessmentVersion: "pulse-v1"`, un identificador y `createdAt` en UTC. La interfaz traduce los códigos a lenguaje amigable.

`pressureResponse` representa lo declarado durante el Pulso. `behavioralSignal`, si se añade posteriormente, se calculará solo a partir de decisiones observadas en el sandbox y se presentará como señal educativa, nunca como diagnóstico psicológico.
