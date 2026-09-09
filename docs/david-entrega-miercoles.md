# David: entrega del miércoles 9 de septiembre

Responsable: David (@DxRxXgSo). Bloque 1: frontend y experiencia visual.
Rama: `feat/responsive-user-experience`.

David, ya tienes los cimientos publicados. Queremos que puedas refinar esta base con tu criterio y proponer mejoras alcanzables para la exposición del viernes 11. No necesitas reconstruirla ni terminar todo el frontend hoy.

## Qué recibes

Inicio, Pulso de cinco preguntas, microlección, sandbox de demostración, Mercado, Portafolio y Perfil. Incluye temas claro/oscuro/sistema, selector de cristal animado, panel lateral plegable, navegación inferior móvil y primeras mejoras de teclado. Los datos y acciones del sandbox son locales y demostrativos; no ejecuta operaciones reales.

## Preparación

Si aún no tienes el repositorio:

```powershell
git clone https://github.com/Kaysito/Nuvyra-VyraAI.git
cd Nuvyra-VyraAI
```

Desde la carpeta del repositorio:

```powershell
git status
git fetch origin
git switch feat/responsive-user-experience
git pull --ff-only
npm ci --prefix apps/web
npm run dev --prefix apps/web
```

Si hay cambios propios, consérvalos antes de cambiar de rama. Abre la dirección que indique el servidor. Si falta Git en tu terminal, puedes descargar y seleccionar la rama desde Visual Studio. La base se ha compilado con Node 24.19.0.

## Obligatorio para hoy, al terminar tu sesión

Estimación de planificación: 3–4 horas. Si tienes menos tiempo, prioriza problemas que impidan recorrer la demo y documenta lo pendiente.

- [ ] Levantar la aplicación y recorrer las siete vistas. Registrar defectos y pasos para reproducirlos (20–30 min).
- [ ] Pulir espaciados, alineaciones y textos en Inicio, Aprende y Practica, manteniendo coherencia entre claro y oscuro (60–90 min).
- [ ] Probar escritorio y 390 px; comprobar también 320 px si alcanza el tiempo. Corregir desbordamientos y botones tapados. Probar panel plegado/desplegado y tema conservado tras recargar (30–45 min).
- [ ] Recorrer con Tab/Shift+Tab. Probar Escape en el diálogo y retorno del foco al botón de apertura (15–20 min).
- [ ] Ejecutar `npm run build --prefix apps/web`, publicar commits pequeños en tu rama y abrir un PR en borrador hacia `main` (20–30 min).
- [ ] Adjuntar al PR una captura de escritorio oscuro y otra de móvil claro, resumen de cambios, pruebas y pendientes para el jueves.

Hoy se considera cumplido con una mejora visual coherente publicada, compilación correcta y defectos pendientes documentados. Si algo bloquea el avance, describe el error y el paso exacto donde ocurre.

## Si queda tiempo

Sustituye los iconos provisionales por un conjunto SVG consistente o refina una microinteracción. Mantén nombres accesibles, foco visible y movimiento reducido. No agregues dependencias para cambios que puedas resolver con CSS/SVG.

## Coordinación

Tu área principal está en `apps/web/src/components`, `apps/web/src/styles.css` y `apps/web/src/themes.css`. Coordina con el líder cambios en `App.tsx`, dependencias o contratos compartidos. Trabaja en tu rama y solicita revisión antes de integrar en `main`; no uses force push.

Autenticación, ejecución real, persistencia de historial y nuevas integraciones requieren coordinación con otros bloques. Reporta las inconsistencias funcionales; evita presentar como terminadas acciones que aún sean demostrativas.

Consulta [la guía de accesibilidad y paleta](frontend-accessibility.md). Todavía falta una auditoría completa: no afirmamos conformidad WCAG de toda la aplicación.

El jueves se orienta a integración, correcciones y ensayo del recorrido. El viernes se reserva para ajustes finales y presentación.
