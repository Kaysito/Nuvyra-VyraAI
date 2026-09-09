# Cimientos visuales para David (@DxRxXgSo)

Rama: `feat/responsive-user-experience`. Objetivo de la entrega: una base que David pueda refinar antes del viernes, no una interfaz cerrada.

## Apariencia

`apps/web/src/themes.css` centraliza la paleta semántica y las adaptaciones de accesibilidad. Se carga después del CSS inicial. Es una capa transitoria: David puede incorporar gradualmente estos tokens en los componentes originales y eliminar reglas duplicadas.

| Uso | Claro | Oscuro |
| --- | --- | --- |
| Fondo | #F3F5EF | #0B1420 |
| Superficie | #F6F9FA | #152334 |
| Texto principal | #123149 | #E5EDF5 |
| Texto secundario | #4E6575 | #B0C0D0 |
| Acento | #08649E | #80C9FF |
| Positivo | #126B50 | #80D9B4 |
| Negativo | #AF3547 | #FFABB7 |

El selector ofrece Sistema, Claro y Oscuro. Guarda la preferencia localmente, escucha cambios del sistema y resuelve el tema antes del primer render. Si el almacenamiento está bloqueado, sigue funcionando durante la sesión. El script inicial debe coordinarse con la política CSP al desplegar (hash o script externo permitido).

El vidrio usa superficies de alta opacidad: medir el contraste sobre el fondo compuesto, no únicamente sobre el color nominal. El blur es decorativo; la lectura debe funcionar sin él. No usar rojo/verde como única indicación: conservar signos y textos. El modo oscuro es una preferencia, no una garantía de comodidad para todas las personas.

## Movimiento y teclado

Transiciones de 160–320 ms, desplazamientos pequeños y sin animación perpetua de cifras o precios. `prefers-reduced-motion` elimina movimiento; se ofrecen fondos sólidos si no hay blur o se solicita transparencia reducida.

Se añadió salto al contenido, nombre de navegación móvil, página activa, foco al cambiar pantalla y controles de al menos 44 px de alto. El diálogo nativo contiene el foco, permite Escape y devuelve el foco al botón de apertura. Revisar también el ancho de los objetivos táctiles y su separación.

## Trabajo acotado para David

1. Refinar iconos SVG y espaciado con ambos temas; mantener nombres accesibles.
2. Probar las siete vistas a 320/390/768 px y escritorio, incluyendo zoom 200 % y reflujo a 400 %.
3. Revisar Tab/Shift+Tab, foco visible y lectura con NVDA; el foco nunca debe quedar bajo la barra móvil.
4. Medir contraste en todos los estados: texto normal mínimo 4.5:1; texto grande 3:1; controles e indicadores necesarios 3:1. Comprobar también tarjetas especiales, gráficas, selección y errores.
5. Mejorar textos, feedback de lecciones y estados vacíos. Probar con dos compañeros y registrar dónde dudan.

No se declara conformidad WCAG completa. Quedan pendientes auditoría automatizada, lector de pantalla, zoom real y revisión de cada estado. El sandbox sigue siendo una demostración con datos y acciones locales: persistencia, ejecución de venta e historial real requieren trabajo funcional separado.

Referencias: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html y https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html.
