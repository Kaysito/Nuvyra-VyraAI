# Draft PR — Block 2: perfil, curso y finanzas conductuales

## Resumen

- Se definió el Pulso de Nuvyra con cinco preguntas de menos de 90 segundos.
- Se implementó un cálculo determinista de experiencia, tolerancia, horizonte, objetivo, riesgo conductual y claridad.
- Se documentaron valores internos, dimensiones, fórmulas, redondeo y casos límite.
- Se incorporó la primera microlección `lesson.volatility` y el curso corto de cinco módulos.
- Se implementaron reglas puras para señales observables de FOMO y venta de pánico.
- Se agregó el contrato de API para perfil, lección, curso y señales de conducta.
- Se agregó `Antes de vender` como intervención informativa que conserva la decisión del usuario.
- Se ampliaron las pruebas de las reglas sin duplicar la lógica financiera en React.

## Reglas principales

- FOMO: subida reciente >= 10 %, concentración >= 35 % o dos o más cambios de plan.
- Venta de pánico: caída reciente >= 15 %, liquidación completa o ruptura del horizonte elegido.
- 1 señal: Bajo.
- 2 señales: Medio.
- 3 señales: Alto.
- La intervención se muestra a partir de nivel Medio.
- Nunca se bloquea la operación ni se usa temporizador.

## Preguntas del Pulso

| # | Dimensión | ID |
|---|---|---|
| 1 | Experiencia | `pulse.experience` |
| 2 | Tolerancia | `pulse.loss-reaction` |
| 3 | Horizonte | `pulse.horizon` |
| 4 | Objetivo | `pulse.objective` |
| 5 | Tolerancia | `pulse.uncertainty` |

## Contratos

Ejemplos completos y valores enumerados: `docs/behavioral-finance-pulse.md`.

## Pruebas

Se agregaron pruebas para:

- perfiles mínimo, máximo e incompletos;
- experiencia y tolerancia;
- claridad y redondeo;
- FOMO;
- venta de pánico;
- umbral de intervención;
- esperar, revisar evidencia y continuar.

**Ejecución local pendiente:** este entorno no tiene instalado el SDK de .NET ni se pudo completar `npm install`, por lo que la ejecución final de `dotnet build`/tests y `npm run build` debe hacerse en el equipo de desarrollo antes de abrir el PR.

## Pendientes

Las reglas que dependan de datos reales de concentración, historial de cambios y operaciones deben conectarse con los datos de los bloques 3 y 4. Mientras tanto, `BehaviorCheckRequest` permite probarlas con casos simulados.

## Nota de coordinación

Los nombres de contrato deben mantenerse coordinados con el bloque 4. Si ese bloque ya publicó nombres distintos, ajustar el contrato antes de integrar el PR.
