# Actividades del bloque 2 para hoy

Responsable: compañero de perfil, curso y finanzas conductuales.
Rama: `feat/learning-and-behavior-profile`.
Tiempo recomendado: 3–4 horas. El objetivo es entregar reglas y contenido que frontend y API puedan consumir mañana.

## 1. Preparar la rama (10 min)

```powershell
git fetch origin
git switch -c feat/learning-and-behavior-profile origin/main
git status
```

Si la rama ya existe, usar `git switch feat/learning-and-behavior-profile` y `git pull --ff-only`.

## 2. Definir el Pulso de Nuvyra (45 min)

Entregar cinco preguntas de opción múltiple que puedan responderse en menos de 90 segundos. Cada pregunta debe indicar qué dimensión mide:

1. Experiencia invirtiendo.
2. Reacción ante una pérdida del 20 %.
3. Horizonte temporal.
4. Objetivo principal.
5. Comodidad con la incertidumbre.

Para cada opción documentar: texto visible, valor interno, dimensión y explicación breve. No pedir datos financieros sensibles ni usar términos como diagnóstico psicológico.

## 3. Definir el cálculo provisional (35 min)

Crear una especificación sencilla y determinista para obtener:

- `experience`: Principiante, Intermedio o Experimentado.
- `tolerance`: Conservadora, Moderada o Alta.
- `horizon`: Corto, Medio o Largo.
- `objective`: Aprender, preservar, crecer o explorar.
- `behavioralRisk`: Bajo, Medio o Alto.
- `clarity`: puntuación de 0 a 100.

Documentar una tabla de respuestas, fórmula de puntuación, redondeo y casos límite. El resultado debe decir que es una referencia adaptable, no una etiqueta permanente ni asesoría personalizada.

## 4. Escribir la primera microlección (45 min)

Completar la ficha `Volatilidad no significa fracaso` con:

- Título y objetivo.
- Situación de entrada en menos de 60 palabras.
- Explicación en lenguaje sencillo.
- Una pregunta.
- Tres opciones.
- Retroalimentación específica para cada opción.
- Aprendizaje clave en una frase.
- Tiempo estimado: menos de cuatro minutos.

Preparar también el esquema de cuatro lecciones siguientes: diversificación, concentración, FOMO y venta de pánico.

## 5. Definir el curso corto (25 min)

Entregar cinco módulos con nombre, objetivo, microlección y criterio de finalización:

1. Entender el riesgo.
2. Leer la volatilidad.
3. Construir una posición.
4. Reconocer sesgos.
5. Practicar antes de decidir.

Cada módulo debe poder completarse en una sesión breve y enlazar con una acción observable en el sandbox.

## 6. Reglas de conducta e intervención (35 min)

Definir señales observables, sin afirmar que la aplicación conoce el estado emocional de una persona:

- FOMO: compra tras una subida rápida, concentración elevada o cambios repetidos de plan.
- Venta de pánico: venta después de una caída brusca, liquidación completa o ruptura del horizonte elegido.

Para cada señal documentar condición, nivel, mensaje, métricas mostradas y acción recomendada. La intervención `Antes de vender` debe explicar la razón, mostrar contexto y permitir continuar. No usar bloqueo obligatorio, temporizador ni lenguaje de guardián.

## 7. Contrato para frontend y API (25 min)

Publicar ejemplos JSON para `ProfileResult`, `Lesson`, `BehaviorSignal` e `Intervention`. Cada objeto debe incluir identificador estable, texto visible y valores enumerados. Usar nombres acordados con el bloque 4 y avisar antes de cambiar un contrato.

## 8. Pruebas (30 min)

Crear pruebas para:

- Perfil mínimo, máximo y respuestas incompletas.
- Clasificación de experiencia y tolerancia.
- Puntuación de claridad y redondeo.
- Detección de compra impulsiva y venta tras caída.
- Umbral que muestra intervención.
- Decisión de esperar, revisar evidencia o continuar.

Las pruebas deben validar reglas puras y mensajes esperados; no probar componentes React con duplicación de lógica financiera.

## Entregado hoy cuando

- Las cinco preguntas caben en menos de 90 segundos.
- Existe la tabla de cálculo y sus casos límite.
- La primera lección dura menos de cuatro minutos y tiene retroalimentación para las tres opciones.
- Hay cinco módulos definidos y una acción práctica para cada uno.
- Las señales de FOMO y pánico tienen condiciones medibles.
- La intervención informa y recomienda, pero conserva la decisión del usuario.
- Existen ejemplos de contrato y pruebas de las reglas.
- Todo está en commits pequeños y en un PR en borrador hacia `main`.

## Mensaje para el PR

Incluye un resumen de reglas, una tabla de preguntas, ejemplos de JSON, pruebas ejecutadas y pendientes. Si una regla requiere datos que todavía no entrega el bloque 3 o el bloque 4, marcarla como pendiente y usar un caso simulado documentado.
