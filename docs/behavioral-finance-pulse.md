# Pulso de Nuvyra, curso y finanzas conductuales

## Alcance

Esta especificación corresponde al Block 2 y define el contenido que consumen frontend y API. El resultado del pulso es una **referencia adaptable** para educación y contexto dentro de Nuvyra. No es una etiqueta permanente, un diagnóstico psicológico ni asesoría financiera personalizada.

Las reglas usan únicamente respuestas y eventos observables del sandbox. No intentan inferir estados emocionales.

## 1. Pulso de Nuvyra

Las cinco preguntas están diseñadas para responderse en menos de 90 segundos.

| ID | Dimensión | Pregunta |
|---|---|---|
| `pulse.experience` | `experience` | ¿Qué experiencia tienes tomando decisiones de inversión? |
| `pulse.loss-reaction` | `tolerance` | Si una inversión que tienes baja 20 %, ¿qué harías primero? |
| `pulse.horizon` | `horizon` | ¿Cuánto tiempo planeas mantener normalmente una inversión? |
| `pulse.objective` | `objective` | ¿Qué te gustaría conseguir principalmente al aprender sobre inversiones? |
| `pulse.uncertainty` | `tolerance` | ¿Qué tan cómodo te sientes cuando no puedes saber con certeza qué hará una inversión? |

### Opciones

#### Experiencia

| Texto visible | Valor | Dimensión | Explicación |
|---|---|---|---|
| Nunca he invertido | `beginner` | experience | Punto de partida inicial. |
| He realizado algunas inversiones | `intermediate` | experience | Experiencia práctica ocasional. |
| Invierto con frecuencia y conozco los conceptos básicos | `experienced` | experience | Experiencia práctica frecuente. |

#### Reacción ante -20 %

| Texto visible | Valor | Dimensión | Explicación |
|---|---|---|---|
| Vendería para evitar perder más | `sell` | tolerance | Menor comodidad ante una caída. |
| Revisaría la situación antes de decidir | `review` | tolerance | Busca contexto antes de actuar. |
| Mantendría la posición si mi plan no ha cambiado | `hold` | tolerance | Mayor disposición a mantener el plan. |

#### Horizonte

| Texto visible | Valor | Dimensión | Explicación |
|---|---|---|---|
| Menos de 1 año | `short` | horizon | Horizonte corto. |
| Entre 1 y 5 años | `medium` | horizon | Horizonte medio. |
| Más de 5 años | `long` | horizon | Horizonte largo. |

#### Objetivo

| Texto visible | Valor | Dimensión | Explicación |
|---|---|---|---|
| Entender mejor cómo funcionan | `learn` | objective | Prioriza aprendizaje. |
| Cuidar lo que ya tengo | `preserve` | objective | Prioriza preservación como objetivo educativo. |
| Buscar crecimiento a largo plazo | `grow` | objective | Prioriza crecimiento como objetivo educativo. |
| Probar diferentes estrategias | `explore` | objective | Prioriza exploración dentro del entorno educativo. |

#### Incertidumbre

| Texto visible | Valor | Dimensión | Explicación |
|---|---|---|---|
| Prefiero evitar mucha incertidumbre | `low` | tolerance | Menor comodidad ante escenarios inciertos. |
| Puedo aceptar cierta incertidumbre | `medium` | tolerance | Comodidad intermedia. |
| Me siento cómodo tomando decisiones con incertidumbre | `high` | tolerance | Mayor comodidad ante escenarios inciertos. |

## 2. Cálculo provisional

La API recibe exactamente cinco valores en `ProfileAssessmentRequest.answers`.

> **Documento histórico parcialmente reemplazado por `pulse-v1`.** Las fórmulas y contratos de puntuación que aparecen debajo se conservan únicamente como registro de una propuesta anterior. No deben implementarse. La fuente vigente mantiene `experience`, `riskDisposition`, `horizon`, `objective` y `pressureResponse` como dimensiones independientes y utiliza señales observables sin diagnósticos.

### Puntuaciones internas descartadas

- Reacción a pérdida: `sell=80`, `review=40`, `hold=20`.
- Incertidumbre: `low=20`, `medium=50`, `high=80`.
- Horizonte: `short=70`, `medium=45`, `long=20`.
- Principiante agrega 10 puntos al riesgo conductual.
- Explorar agrega 5 puntos al riesgo conductual.

### Fórmula

```text
behavioralRiskRaw =
  reactionScore * 0.45
  + uncertaintyScore * 0.30
  + horizonScore * 0.15
  + experienceAdjustment
  + objectiveAdjustment
```

El resultado se redondea al múltiplo de 5 más cercano, con `MidpointRounding.AwayFromZero`, y se limita a `0..100`.

La tolerancia usa:

```text
toleranceScore = round5(reactionScore * 0.50 + uncertaintyScore * 0.50)
```

Clasificación:

- `< 40`: `Conservadora`
- `40..69`: `Moderada`
- `>= 70`: `Alta`

El riesgo conductual se presenta como:

- `< 35`: `Bajo`
- `35..64`: `Medio`
- `>= 65`: `Alto`

Experiencia:

- `beginner` → `Principiante`
- `intermediate` → `Intermedio`
- `experienced` → `Experimentado`

Horizonte:

- `short` → `Corto`
- `medium` → `Medio`
- `long` → `Largo`

Objetivo:

- `learn` → `Aprender`
- `preserve` → `Preservar`
- `grow` → `Crecer`
- `explore` → `Explorar`

### Claridad

La claridad representa completitud del pulso, no seguridad sobre una decisión.

```text
clarity = respuestas válidas / 5 * 100
```

Se redondea al múltiplo de 5 y se limita a `0..100`.

Casos límite:

- Sin respuestas o `null` → `0`.
- 1 respuesta válida → `20`.
- 2 → `40`.
- 3 → `60`.
- 4 → `80`.
- 5 → `100`.
- Más de 5 respuestas → se consideran solo las primeras cinco para claridad, pero el cálculo del perfil rechaza el conjunto por no contener exactamente cinco respuestas.
- Una respuesta vacía hace que el cálculo del perfil sea rechazado.

El resultado debe considerarse adaptable y revisable. No representa una clasificación permanente ni una recomendación financiera personalizada.

## 3. Primera microlección

**ID:** `lesson.volatility`

**Título:** Volatilidad no significa fracaso.

**Objetivo:** distinguir un movimiento de precio de un cambio en el plan.

**Escenario:** Compraste un activo pensando en conservarlo tres años. Esta semana cae 18 %. El precio cambió rápidamente, pero tu horizonte no necesariamente cambió.

**Explicación:** La volatilidad describe qué tan fuerte y rápido se mueve un precio. Una caída aislada no dice por sí sola si el plan sigue siendo válido. Primero compara el movimiento con tu objetivo, horizonte y motivo original.

**Pregunta:** ¿Qué información revisarías primero?

Opciones:

1. El comentario más reciente en redes.
2. Mi objetivo, horizonte y motivo de compra.
3. Solo el porcentaje de caída.

**Retroalimentación:**

- Redes: una señal de redes puede aumentar la urgencia, pero no sustituye el contexto del plan.
- Plan: el plan original aporta contexto antes de reaccionar a un movimiento aislado.
- Porcentaje: describe el movimiento, pero no explica por sí solo qué significa para la decisión.

**Aprendizaje clave:** Una caída de precio es un dato; la decisión debe considerar también el plan y el contexto.

**Tiempo:** 3 minutos.

### Siguientes cuatro lecciones

1. **Diversificación** — cómo repartir exposición para no depender de una sola posición.
2. **Concentración** — cómo identificar cuándo una posición tiene demasiado peso en el portafolio.
3. **FOMO** — cómo reconocer señales observables de compras después de subidas rápidas.
4. **Venta de pánico** — cómo revisar contexto antes de vender después de una caída brusca.

## 4. Curso corto

| ID | Módulo | Objetivo | Acción observable |
|---|---|---|---|
| `module.risk` | Entender el riesgo | Diferenciar riesgo y pérdida potencial de fracaso. | Registrar una decisión virtual y anotar qué dato del escenario la cambió. |
| `module.volatility` | Leer la volatilidad | Observar movimientos sin convertir una variación diaria en una conclusión automática. | Simular una caída y revisar el porcentaje. |
| `module.position` | Construir una posición | Entender cómo el tamaño cambia el peso de una posición. | Crear una posición virtual y revisar concentración. |
| `module.biases` | Reconocer sesgos | Reconocer señales observables de FOMO y venta de pánico. | Revisar un caso de compra tras subida o venta tras caída. |
| `module.practice` | Practicar antes de decidir | Usar contexto, evidencia y horizonte antes de continuar. | Abrir `Antes de vender`, revisar métricas y registrar una decisión. |

Cada sesión es breve y termina en una acción observable dentro del sandbox.

## 5. Reglas de conducta e intervención

### FOMO

No se afirma que el usuario esté emocionado o tenga FOMO. Solo se detectan eventos observables.

| Condición | Nivel |
|---|---|
| 1 señal activa | Bajo |
| 2 señales activas | Medio |
| 3 señales activas | Alto |

Señales:

- subida reciente `>= 10 %`;
- concentración de la posición `>= 35 %`;
- dos o más cambios de plan.

Mensaje: la decisión coincide con señales observables de una compra después de un movimiento rápido y conviene revisar el plan.

Métricas: señales activas, subida reciente, concentración y cambios de plan.

Acción recomendada: comparar objetivo, horizonte y concentración antes de confirmar.

### Venta de pánico

Se usan las mismas reglas de lenguaje: son señales observables, no un diagnóstico.

| Condición | Nivel |
|---|---|
| 1 señal activa | Bajo |
| 2 señales activas | Medio |
| 3 señales activas | Alto |

Señales:

- caída reciente `>= 15 %`;
- liquidación completa;
- ruptura del horizonte elegido.

Mensaje: la venta coincide con señales observables de una caída brusca o una salida que cambia el plan.

Métricas: caída reciente, liquidación y horizonte.

Acción recomendada: revisar movimiento, horizonte y razón original de la posición; después decidir.

### Umbral de intervención

La intervención informativa se muestra para niveles `Medio` y `Alto`. El nivel `Bajo` puede quedar como señal contextual sin abrir la pausa.

`Antes de vender`:

- explica por qué aparece;
- muestra pérdida/movimiento, volatilidad y horizonte;
- permite `Esperar 24 horas`;
- permite `Revisar evidencia`;
- permite `Continuar con la venta`;
- no bloquea;
- no usa temporizador;
- no usa lenguaje de guardián.

## 6. Contratos API/frontend

### `ProfileResult` descartado

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "experience": "Principiante",
  "tolerance": "Conservadora",
  "horizon": "Corto",
  "objective": "Aprender",
  "behavioralRisk": "Medio",
  "behavioralRiskScore": 50,
  "clarity": 100
}
```

### `Lesson`

```json
{
  "id": "lesson.volatility",
  "title": "Volatilidad no significa fracaso",
  "objective": "Distinguir un movimiento de precio de un cambio en el plan.",
  "scenario": "Compraste un activo pensando en conservarlo tres años. Esta semana cae 18 %.",
  "explanation": "La volatilidad describe qué tan fuerte y rápido se mueve un precio.",
  "question": "¿Qué información revisarías primero?",
  "options": ["El comentario más reciente en redes", "Mi objetivo, horizonte y motivo de compra", "Solo el porcentaje de caída"],
  "feedback": ["...", "El plan original aporta contexto.", "..."],
  "keyLearning": "Una caída de precio es un dato; la decisión debe considerar también el plan y el contexto.",
  "estimatedMinutes": 3,
  "completionAction": "Completar la pregunta y revisar el escenario en el sandbox."
}
```

### `BehaviorSignal`

```json
{
  "id": "signal.fomo",
  "type": "Fomo",
  "level": "High",
  "message": "La decisión coincide con señales observables de una compra después de un movimiento rápido.",
  "metrics": ["señales activas: 3", "subida reciente", "concentración", "cambios de plan"],
  "recommendedAction": "Compara la compra con tu objetivo, horizonte y concentración antes de confirmar."
}
```

### `Intervention`

```json
{
  "id": "intervention.before-sell",
  "title": "Antes de vender",
  "reason": "La venta coincide con señales observables de una caída brusca o una salida que cambia el plan.",
  "metrics": ["movimiento", "volatilidad", "horizonte"],
  "actions": ["wait24Hours", "reviewEvidence", "continueSale"],
  "allowsContinue": true
}
```

Los identificadores son estables. Los valores enumerados son los que usa la API. Si el bloque 4 necesita cambiar nombres de contrato, se debe avisar antes de modificar estos valores.

## 7. Pruebas

Las reglas se prueban directamente en `BehavioralFinanceRules`, sin duplicarlas en React.

Cobertura incluida:

- perfil con cero, cinco y respuestas incompletas;
- clasificación de experiencia;
- clasificación de tolerancia;
- claridad y redondeo;
- riesgo dentro de `0..100` y redondeado a 5;
- FOMO con 0, 1 y 3 señales;
- venta de pánico con 0, 1 y 2 señales;
- umbral de intervención;
- alternativas de esperar, revisar evidencia y continuar.

## 8. Pendientes con bloques 3 y 4

Las señales que dependan de datos reales de portafolio, concentración o historial de cambios deben conectarse cuando esos datos estén disponibles. Mientras tanto, `BehaviorCheckRequest` permite ejecutar casos simulados documentados para validar las reglas sin inventar datos reales del usuario.
