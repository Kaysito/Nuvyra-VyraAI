# Matriz QA de la demo

Fecha objetivo: viernes 11 de septiembre de 2026.

## Recorrido P0

| ID | Escenario | Resultado esperado | Prioridad | Estado |
|---|---|---|---|---|
| QA-01 | Cargar Inicio | La aplicación carga sin error y explica Nuvyra en menos de 30 segundos | Bloqueante | Pendiente de ejecución manual |
| QA-02 | Completar las cinco preguntas | Se muestra 1/5 a 5/5 y el perfil provisional con cinco dimensiones | Bloqueante | Automatizado |
| QA-03 | Omitir una respuesta | No se avanza ni se crea perfil incompleto | Alto | Automatizado |
| QA-04 | Abrir Aprende | Se cargan lecciones desde la API o se muestra error comprensible | Bloqueante | Automatizado |
| QA-05 | Practicar compra válida | Se descuenta el importe y aparece la posición | Bloqueante | Backend automatizado |
| QA-06 | Comprar con saldo insuficiente | La operación se rechaza sin mutar el portafolio | Bloqueante | Backend automatizado |
| QA-07 | Vender posición | Se actualizan efectivo, cantidad y rendimiento | Alto | Backend automatizado |
| QA-08 | Simular caída | Cambia únicamente el escenario de Práctica | Bloqueante | Pendiente de ejecución manual |
| QA-09 | Abrir Mercado después de la caída | Mercado conserva datos demo de referencia | Alto | Pendiente de ejecución manual |
| QA-10 | Antes de vender | Aparecen las tres decisiones y el texto no es prescriptivo | Alto | Automatizado |
| QA-11 | Reiniciar demo | Se restauran 10,000 USD y las posiciones iniciales; repetirlo es idempotente | Bloqueante | Backend automatizado |
| QA-12 | Doble clic en comprar/vender | No produce una mutación duplicada accidental | Alto | Pendiente de ejecución manual |
| QA-13 | Error de API o backend apagado | Se muestra estado de error y opción de recuperación | Alto | Automatizado parcialmente |
| QA-14 | Teclado y lector | Foco visible, botones accesibles, Escape cierra diálogos | Alto | Automatizado parcialmente |
| QA-15 | Móvil, tablet y escritorio | Sin desbordamiento horizontal ni controles inutilizables | Alto | Pendiente de ejecución manual |

## Criterio de severidad

- **Bloqueante:** impide presentar o corrompe el estado financiero simulado.
- **Alto:** rompe una parte principal del recorrido o accesibilidad crítica.
- **Medio:** defecto visible con alternativa funcional.
- **Bajo:** detalle cosmético sin impacto en el recorrido.

## Evidencia requerida

Registrar para cada caso: commit probado, navegador/viewport, pasos, resultado observado y captura o log cuando falle. Abrir un issue por defecto, enlazarlo en la matriz y no ocultar fallos mediante exclusiones de cobertura.
