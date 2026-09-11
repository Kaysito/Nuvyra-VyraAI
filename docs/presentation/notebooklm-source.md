# Nuvyra — fuente maestra para exposición

## Propósito de este documento

Este archivo reúne la información que NotebookLM debe usar para generar una presentación de Nuvyra. El código actual y este documento son la fuente de verdad. No debe usar especificaciones antiguas de KairosAI ni afirmar que una función futura ya está implementada.

## Resumen ejecutivo

Nuvyra es una plataforma de educación y práctica financiera que ayuda a las personas a comprender inversiones, ensayar decisiones con dinero virtual y revisar el contexto antes de actuar bajo presión.

La primera experiencia conecta cinco elementos que suelen encontrarse separados:

1. Un perfil inicial breve y provisional.
2. Microlecciones financieras.
3. Un sandbox de inversión con dinero virtual.
4. Datos de mercado y escenarios de volatilidad.
5. Una intervención educativa llamada «Antes de vender».

Nuvyra explica y contextualiza. La persona conserva la decisión final.

## Problema

Las personas que comienzan a invertir suelen enfrentar tres dificultades al mismo tiempo:

- Conceptos financieros presentados con demasiada complejidad.
- Herramientas fragmentadas entre cursos, simuladores, datos y seguimiento.
- Decisiones apresuradas durante subidas o caídas pronunciadas.

Muchas aplicaciones resuelven una sola parte. Una enseña, otra muestra precios, otra permite operar y otra registra el portafolio. La persona debe conectar por sí sola la información con su experiencia, objetivo y horizonte.

Nuvyra propone un recorrido continuo. La educación desemboca en práctica y la práctica produce contexto para una decisión posterior.

## Público objetivo

### Público principal

Personas de 18 a 35 años que sienten curiosidad por invertir, tienen experiencia inicial o intermedia y necesitan una forma breve de aprender antes de comprometer dinero real.

### Públicos secundarios

- Personas que ya invierten, pero desean revisar concentración, volatilidad y decisiones impulsivas.
- Instituciones educativas que necesitan un laboratorio financiero demostrable.
- Fintech y entidades financieras que buscan una experiencia de onboarding educativo.

### Necesidades principales

- Aprender sin sesiones de veinte o treinta minutos.
- Practicar sin perder dinero real.
- Entender el riesgo con lenguaje claro.
- Recibir contexto sin perder autonomía.
- Avanzar desde contenido introductorio hacia decisiones mejor fundamentadas.

## Misión

Ayudar a las personas a comprender y practicar decisiones financieras mediante educación breve, simulación segura y explicaciones contextualizadas.

## Visión

Convertir Nuvyra en una plataforma de acompañamiento financiero que conecte aprendizaje, práctica, análisis y decisiones reales autorizadas por el usuario, con reglas auditables y una inteligencia artificial responsable.

## Principios del producto

- El usuario conserva el control.
- El perfil inicial es provisional y evoluciona con la práctica.
- Las señales describen conductas observables y no diagnostican emociones.
- Los cálculos financieros usan reglas deterministas.
- La IA futura explicará señales. No calculará saldos ni inventará precios.
- El sandbox y las operaciones reales deben permanecer claramente separados.
- La presentación debe identificar los datos simulados.

## Recorrido del usuario

### 1. Inicio

La bienvenida explica en menos de treinta segundos qué hace Nuvyra y diferencia la práctica virtual de una inversión real.

### 2. Pulso inicial

El cuestionario contiene cinco preguntas y busca completarse en menos de noventa segundos. No suma todas las respuestas en un único score.

Dimensiones independientes:

- Experiencia: inicial, intermedia o avanzada.
- Disposición al riesgo: baja, media o alta.
- Horizonte: corto, medio, largo o sin definir.
- Objetivo: preservación, crecimiento, ingresos o sin definir.
- Respuesta ante presión: actuar ahora, revisar antes de actuar, pausar y revisar o todavía no saberlo.

El resultado usa `assessmentVersion = pulse-v1` y se identifica como provisional.

### 3. Aprende

El MVP contiene una microlección completa: «Volatilidad no significa fracaso». La lección presenta una situación, una explicación, una pregunta, opciones, retroalimentación y un aprendizaje clave. Su duración estimada es de tres minutos.

El curso contempla cinco módulos:

- Entender el riesgo.
- Leer la volatilidad.
- Construir una posición.
- Reconocer sesgos.
- Practicar antes de decidir.

El MVP ya expone la estructura de los cinco módulos. Por ahora todos utilizan la primera microlección como contenido disponible. Las siguientes lecciones pertenecen al roadmap.

### 4. Practica

El sandbox comienza con 10,000 USD virtuales y cotizaciones de BTC, ETH y SOL. Permite comprar, vender, consultar posiciones y observar rendimiento porcentual.

El sistema valida cantidades, saldo disponible y existencia de posiciones. El reinicio devuelve exactamente el estado inicial. La simulación de caída es idempotente y no acumula caídas al pulsar varias veces.

### 5. Antes de vender

Cuando una persona revisa una venta durante una caída, Nuvyra muestra pérdida actual, volatilidad, una explicación y tres alternativas:

- Esperar 24 horas.
- Revisar evidencia.
- Continuar con la venta.

Nuvyra no bloquea la operación. La interfaz debe mantener una jerarquía visual neutral entre alternativas.

### 6. Perfil progresivo

La visión futura actualiza el perfil con señales observables del sandbox y aprendizaje completado. El sistema no afirmará que conoce la personalidad del usuario.

## VyraPoints

VyraPoints es un concepto de progreso educativo. Premia acciones que demuestran aprendizaje y revisión de contexto, no la ganancia económica ni la cantidad de operaciones.

Ejemplos propuestos:

- Completar el Pulso.
- Terminar una microlección.
- Probar una acción en el sandbox.
- Revisar «Antes de vender».
- Mantener una racha de aprendizaje.

Estado actual: concepto y posible demostración local. No existe todavía persistencia definitiva ni un sistema productivo de recompensas. La presentación debe mostrarlo como siguiente incremento del producto si el equipo no termina su implementación antes de la exposición.

## Qué diferencia a Nuvyra

Nuvyra no reclama que cada función sea inédita. Su diferencia está en conectar varias capacidades dentro de un mismo recorrido educativo.

| Capacidad | Herramientas especializadas | Nuvyra |
| --- | --- | --- |
| Educación breve | Suele vivir en un curso separado | La lección conduce al sandbox |
| Perfil | Puede limitarse a tolerancia al riesgo | Separa cinco dimensiones y lo declara provisional |
| Simulación | Practica órdenes virtuales | Relaciona la práctica con objetivo y horizonte |
| Mercado | Muestra precios y variaciones | Añade contexto educativo y procedencia del dato |
| Intervención | Alertas o bloqueos | Explica, muestra alternativas y deja decidir |
| Progreso | Premia actividad | VyraPoints pretende premiar aprendizaje y reflexión |

Mensaje central para la exposición: Nuvyra reúne educación, perfil, simulación, mercado e intervención en una sola experiencia conectada.

## Estado real del MVP

### Implementado

- Web responsiva con React, TypeScript y Vite.
- Tema claro y oscuro.
- Navegación entre Inicio, Aprende, Práctica, Mercado, Portafolio y Perfil.
- `pulse-v1` con cinco dimensiones independientes.
- Curso estructurado y primera microlección.
- Sandbox virtual con compra, venta, portafolio, caída y reinicio.
- Intervención «Antes de vender» y registro de decisión.
- API ASP.NET Core con contratos tipados.
- Formato consistente de errores con código y `traceId`.
- Fuente local determinista para la demo.
- Cliente HTTP del frontend con manejo de errores.
- CI, CodeQL, auditoría de dependencias y escaneo de secretos.
- 647 pruebas frontend y 14 verificaciones backend en la última integración confirmada.

### En desarrollo o siguiente incremento

- VyraPoints persistentes.
- Más microlecciones completas.
- Perfil progresivo basado en historial.
- Persistencia con PostgreSQL.
- Datos externos de mercado con fallback local.
- Explicaciones generadas por IA.
- Autenticación y cuentas.
- Integración con inversiones reales mediante un socio regulado.

### Fuera del MVP actual

- Órdenes con dinero real.
- Custodia de fondos.
- Predicciones garantizadas.
- Diagnóstico psicológico.
- Bloqueo forzoso de compras o ventas.

## Arquitectura

Nuvyra utiliza un monolito modular. Esta estructura permite trabajar con rapidez y conservar límites claros sin asumir la complejidad operativa de microservicios.

Capas:

- `Nuvyra.Domain`: reglas financieras y modelos sin dependencias de frameworks.
- `Nuvyra.Application`: casos de uso e interfaces.
- `Nuvyra.Infrastructure`: fuentes de mercado y adaptadores.
- `Nuvyra.Contracts`: mensajes públicos tipados.
- `Nuvyra.Api`: endpoints HTTP, CORS y manejo de errores.
- `apps/web`: interfaz React responsiva.

Dependencias permitidas:

`Api` depende de `Application` y `Domain`. `Infrastructure` implementa interfaces de aplicación. `Contracts` conserva los mensajes públicos.

Evolución prevista:

- PostgreSQL será la única fuente de verdad cuando llegue la persistencia.
- Redis se añadirá solo si aparecen necesidades medidas de caché, rate limiting o coordinación efímera.
- Un módulo podrá extraerse como microservicio cuando necesite escala, disponibilidad, seguridad o ritmo de entrega independiente.

## API demostrable

La API actual incluye:

- Salud de la aplicación.
- Cotizaciones.
- Preguntas de `pulse-v1`.
- Evaluación del perfil.
- Lecciones y curso.
- Portafolio virtual.
- Compra y venta virtual.
- Simulación de caída.
- Reinicio de la demo.
- Intervención antes de vender.
- Registro de decisión.
- Señales conductuales observables.

## Seguridad y ética

- Nuvyra no almacena secretos en el repositorio.
- GitHub Actions ejecuta compilación y verificaciones.
- CodeQL analiza el código.
- Las dependencias NuGet y npm se auditan.
- Gitleaks revisa secretos.
- La API no devuelve stack traces al usuario.
- Los datos del MVP viven en memoria y son deliberadamente simulados.
- La IA futura no podrá alterar saldos, impedir una operación ni inventar precios.
- Las inversiones reales requerirán integración con infraestructura regulada y revisión jurídica.

## Herencia de KairosAI

Nuvyra conserva del proyecto KairosAI:

- El sandbox.
- El perfil de experiencia y riesgo.
- La intervención ante una venta bajo presión.
- La educación contextual.
- El interés por FOMO y venta de pánico.

Nuvyra descarta:

- El código anterior.
- La arquitectura multi-base sin una necesidad demostrada.
- El bloqueo forzoso de operaciones durante 48 o 72 horas.
- El modelo de IA como autoridad financiera.
- Configuraciones y deuda técnica heredadas.

## Modelo de negocio hipotético

La exposición puede presentar estas rutas como hipótesis, no como ingresos confirmados:

- Suscripción freemium para educación y análisis avanzado.
- Licenciamiento B2B para instituciones educativas.
- Onboarding educativo para fintech y entidades financieras.
- Integración con proveedores regulados para operaciones reales autorizadas por el usuario.

## Roadmap

### Etapa 1 — Demo actual

Perfil provisional, primera lección, sandbox determinista, intervención y recorrido web.

### Etapa 2 — Producto educativo

Curso completo, progreso, VyraPoints, historial y persistencia con PostgreSQL.

### Etapa 3 — Inteligencia contextual

Datos externos con fallback, perfil progresivo y explicaciones de IA basadas en métricas auditables.

### Etapa 4 — Ecosistema financiero

Autenticación robusta, consentimiento, cumplimiento y conexión con proveedores regulados para inversiones reales.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| Confundir educación con asesoría financiera | Lenguaje neutral, avisos claros y control del usuario |
| Mostrar datos desactualizados | `source`, `asOf` y fallback local identificado |
| Sobreinterpretar conducta | Señales observables y perfil provisional |
| Perder consistencia financiera | Reglas deterministas y pruebas de dominio |
| Escalar antes de tiempo | Monolito modular y extracción basada en métricas |
| Depender de internet en la exposición | Datos locales y recorrido offline |

## Estructura recomendada de la presentación

1. Portada: Nuvyra y su propósito.
2. Problema: aprendizaje fragmentado y decisiones sin contexto.
3. Público objetivo y necesidades.
4. Solución: una experiencia conectada.
5. Recorrido del usuario.
6. Pulso y perfil provisional.
7. Curso corto y aprendizaje práctico.
8. Sandbox y «Antes de vender».
9. VyraPoints y progreso educativo.
10. Diferenciación frente a herramientas separadas.
11. Estado real del MVP.
12. Arquitectura y capacidad de evolución.
13. Seguridad, IA responsable y límites.
14. Roadmap y visión de largo plazo.
15. Cierre y demostración.

## Reparto para cuatro presentadores

### Presentador 1

Problema, público objetivo, misión y propuesta de valor.

### Presentador 2

Pulso inicial, perfil provisional, curso y VyraPoints.

### Presentador 3

Sandbox, caída simulada, «Antes de vender» y demostración.

### Presentador 4

Arquitectura, seguridad, IA responsable, inversiones reales futuras y roadmap.

La quinta persona controla el tiempo, ejecuta la demo y tiene preparado el video de respaldo.

## Diseño de diapositivas

- Formato 16:9.
- Fondo principal blanco crema `#F3F5EF`.
- Azul navy de marca `#0B2742`.
- Azul profundo `#123A5A`.
- Azul principal `#2F6FEB`.
- Cyan `#39B8EA`.
- Azul hielo `#B9D8E8`.
- Fondo oscuro `#0B1420`.
- Superficie oscura `#102337`.
- Texto oscuro `#102337`.
- Texto secundario `#4E6575`.
- Éxito `#80D9B4`.
- Advertencia `#E3A82B`.
- Riesgo `#FFABB7`.
- Manrope para títulos e Inter para texto.
- Usar una composición limpia por diapositiva.
- Evitar paneles excesivos, texto pequeño, gráficas de ganancias y estética de casino.
- Identificar con claridad los datos simulados.

## Archivos visuales que deben acompañar esta fuente

- `assets/nuvyra-app-icon-white.png`: icono cuadrado para portada o impresión.
- `assets/nuvyra-logo-lockup-v2.png`: logo con nombre y tagline.
- `assets/nuvyra-color-system-complete.png`: sistema de color.
- `assets/nuvyra-logo-construction-v2.png`: construcción del símbolo.
- `assets/nuvyra-unified-experience-v2.png`: comparación de capacidades separadas y experiencia unificada.
- `assets/nuvyra-demo-storyboard.png`: referencia del recorrido de demostración. Usar únicamente si el logo mostrado coincide con el símbolo oficial.

## Mensajes que debe evitar la presentación

- «Nuvyra predice el mercado».
- «Nuvyra evita pérdidas».
- «La IA sabe qué inversión debes comprar».
- «El perfil diagnostica al usuario».
- «El MVP ya permite invertir dinero real».
- «Nuvyra es la única aplicación con estas funciones».

## Mensaje final sugerido

Nuvyra conecta aprendizaje, práctica y contexto para que una persona comprenda mejor una decisión financiera antes de tomarla.
