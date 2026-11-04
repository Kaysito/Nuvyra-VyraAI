# Nuvyra Constitution

**Versión:** 0.2.0
**Estado:** Aprobada por el Product Owner
**Fecha:** 2026-11-03
**Proyecto:** Nuvyra / VyraAI
**Enfoque de desarrollo:** Spec-Anchored Spec-Driven Development (SDD)
**Ruta recomendada en el repositorio:** `docs/constitution/constitution.md`
**Responsable de aprobación:** Product Owner / fundador de Nuvyra
**Aprobación humana:** concedida explícitamente por el Product Owner el 2026-11-03

> **Misión rectora:** Nuvyra existe para que más personas puedan aprender a invertir, comprender sus opciones y tomar decisiones financieras informadas. Vyra aporta inteligencia contextual, no sustituye la voluntad del usuario. La plataforma debe ser rigurosa con los datos, transparente con la incertidumbre y responsable con los patrones conductuales que observa.

---

## 0. Naturaleza de este documento

Esta Constitución establece obligaciones de producto, ingeniería, investigación, seguridad, privacidad y gobernanza para Nuvyra. No es un backlog, una especificación de feature, un manual de marketing ni una autorización para ofrecer servicios financieros regulados. Su propósito es limitar y orientar las decisiones futuras, incluidas las que propongan o ejecuten agentes de IA.

Los términos **MUST / DEBE**, **MUST NOT / NO DEBE**, **SHOULD / DEBERÍA** y **MAY / PUEDE** expresan niveles de exigencia: obligación, prohibición, expectativa sujeta a justificación y posibilidad opcional, respectivamente. Las obligaciones nunca se relajan por conveniencia del agente.

La Constitución se interpreta atendiendo conjuntamente a su texto y a la finalidad de proteger la autonomía, la claridad y la seguridad de las personas. Ningún agente puede declarar aprobado este documento ni sus reformas por cuenta propia.

## 1. Autoridad, precedencia y conflictos

1. Las obligaciones legales y regulatorias aplicables, los derechos de las personas y las medidas de seguridad exigibles prevalecen sobre cualquier norma interna. Esta Constitución no sustituye asesoría legal ni permisos regulatorios.
2. Dentro del repositorio, la precedencia es: **Constitution → especificaciones de producto aprobadas → decisiones arquitectónicas (ADR) aprobadas → planes técnicos → tareas → implementación → pruebas y evidencia de validación → documentación derivada**.
3. `AGENTS.md` gobierna el procedimiento operativo de los agentes, pero no puede cambiar la política constitucional ni sustituir una especificación aprobada. `README.md`, prompts y comentarios de código no pueden contradecir documentos de nivel superior.
4. Si una especificación contradice la Constitución, la especificación se bloquea hasta su corrección o una reforma constitucional humana. Si una especificación y un ADR discrepan, el agente no debe elegir silenciosamente: debe señalar el conflicto y proponer una resolución que respete ambos objetivos o solicitar decisión humana.
5. **Optimizar tiempos no equivale a saltarse controles.** Se permite condensar ceremonias o documentación cuando no se pierdan requisitos, pruebas, trazabilidad ni revisión humana necesaria.
6. Toda excepción debe seguir el procedimiento de la sección 21. Una excepción jamás puede legalizar una práctica ilegal ni autorizar afirmaciones falsas.

**Criterio de verificación:** ningún PR de alcance significativo podrá cerrarse si mantiene un conflicto constitucional conocido sin decisión humana documentada.

## 2. Alcance

Esta Constitución aplica a frontend, backend, dominio, APIs, infraestructura, persistencia, scripts, migraciones, tests, documentación, especificaciones, ADR, agentes, prompts, datasets, telemetría, analítica, modelos predictivos y generativos, experiencia de usuario, simulaciones, contenido educativo, integraciones y servicios futuros. Abarca entornos locales, demostraciones, betas y producción. El carácter académico o experimental permite alcance reducido, **no permite presentar falsedades, manejar datos sin cuidado o fabricar resultados**.

La Constitución es estable; las metas temporales se ubican en un anexo de entrega para evitar convertir decisiones de una exposición en restricciones permanentes de la empresa.

## 3. Glosario vinculante

- **Decisión financiera:** elección relativa a comprar, vender, mantener, diversificar, asignar o administrar activos o recursos, real o simulada.
- **Simulación:** operación o escenario sin transacción real ni custodia de fondos reales.
- **Dato observado:** evento registrable sin atribución psicológica; por ejemplo, abrir una pantalla o cancelar una orden.
- **Señal conductual:** medida derivada de datos observados, como repetición de acciones o tiempo de decisión.
- **Línea base personal:** referencia calculada con historial suficiente y metodología documentada para describir un comportamiento habitual; su ausencia no se suple con valores inventados.
- **Desviación conductual:** diferencia cuantificada entre actividad actual y una referencia identificada; **no es una emoción ni un diagnóstico**.
- **Perfil de riesgo:** conjunto de preferencias, capacidad y tolerancia al riesgo, horizonte y objetivos registrados con procedencia y fecha de actualización; no equivale automáticamente a autorización para recomendar productos concretos.
- **Fuente de verdad:** componente autoritativo para un dato determinado; por ejemplo, el motor de portafolio para posiciones y saldos simulados.
- **Proveniencia:** origen, naturaleza, fecha y transformaciones relevantes de un dato.
- **Análisis prospectivo:** estimación sobre escenarios futuros basada en información y método identificables; no constituye certidumbre.
- **Recomendación:** alternativa sugerida con argumentos, supuestos, límites y, cuando corresponde, advertencias; **no es una orden**.
- **Vyra:** asistente de Nuvyra encargado de explicar, contextualizar, comparar, proyectar y, dentro de los límites legales y del producto, recomendar alternativas.
- **Behavioral Assistance:** función que usa señales conductuales permitidas para ofrecer reflexiones o intervenciones contextuales.
- **Offline-capable:** capacidad de completar el flujo central una vez preparados los componentes locales, sin conexión a Internet. No exige que las futuras funcionalidades productivas operen todas desconectadas.
- **Intervención:** elemento contextual opcional —aviso, comparación, pausa breve o invitación a reflexionar— que no reemplaza la decisión del usuario.
- **Evidencia de validación:** pruebas automatizadas, comprobaciones manuales reproducibles, resultados de evaluación o registros de revisión vinculados a un requisito.

## 4. Principio I — Autonomía y soberanía del usuario

1. La persona conserva la última decisión sobre inversiones y operaciones permitidas por el sistema. **Vyra no ejecuta, modifica ni cancela operaciones por iniciativa propia.**
2. Nuvyra puede ofrecer advertencias, análisis, alternativas, escenarios, educación, confirmaciones y pausas proporcionadas; no puede imponer una elección por considerar que el usuario está emocionalmente alterado.
3. Un indicador de desviación conductual, por sí solo, **no autoriza bloquear una operación**. Las restricciones por seguridad, saldo, validación, prevención de fraude, normativa o funcionamiento de mercado son distintas y deberán tener fundamento explícito.
4. Toda recomendación debe permitir al usuario comprender que puede no seguirla. Un flujo de reflexión debe ofrecer una vía clara para continuar o desistir, sin vergüenza ni presión moral.
5. La autonomía incluye el derecho a aprender de resultados desfavorables. La plataforma no promete evitar errores ni convertir todo resultado en ganancia.

**Verificación:** las pruebas de aceptación de Before Selling deben demostrar que una desviación conductual elevada no bloquea definitivamente una operación simulada válida.

## 5. Principio II — Seguridad, veracidad y separación entre simulación y realidad

1. Nuvyra **NO DEBE** presentar operaciones, posiciones, rendimientos o datos de mercado simulados como reales o actuales.
2. Toda pantalla de simulación debe mostrar una identificación comprensible de su naturaleza; las cifras hipotéticas no deben aparecer con el mismo estatus que cotizaciones reales.
3. Nuvyra y Vyra **NO DEBEN** garantizar rendimiento, recuperación, rentabilidad, precio objetivo o resultado futuro.
4. Deben distinguirse los hechos históricos, precios actuales con su fecha, escenarios hipotéticos, estimaciones estadísticas y explicaciones generadas por IA.
5. Toda comparación financiera debe mostrar sus supuestos relevantes y evitar omisiones que alteren materialmente su significado, como confundir ganancia nominal con ganancia neta de costos cuando esos costos sí estén dentro del alcance del caso.
6. Datos externos desactualizados deben etiquetarse como tales. Ausencia de cotización real no habilita sustituirla silenciosamente por un dato inventado.
7. La incorporación de dinero real, custodia, corretaje, criptoactivos operados o asesoría personalizada queda condicionada a especificación propia, revisión legal y regulatoria pertinente, seguridad reforzada y aprobaciones humanas antes de habilitarla.

**Verificación:** tests de presentación y API distinguen `SIMULATED`, `HISTORICAL`, `LIVE`, `HYPOTHETICAL` y `UNAVAILABLE` cuando sea aplicable.

## 6. Principio III — Proveniencia y trazabilidad de datos

Toda cifra o señal relevante debe identificar su naturaleza y origen mediante metadatos adecuados. Clasificaciones mínimas recomendadas:

- `USER_PROVIDED`
- `SYSTEM_CALCULATED`
- `SIMULATED`
- `EXTERNAL_HISTORICAL`
- `EXTERNAL_CURRENT`
- `MODEL_DERIVED`
- `AI_GENERATED`
- `UNAVAILABLE`

El esquema concreto puede evolucionar, pero debe preservar la distinción. Para valores importantes se debe poder localizar fuente, marca temporal o período, cálculo/modelo cuando corresponda y limitaciones relevantes. Un texto redactado por Vyra no convierte la estimación subyacente en un hecho. Los datos mostrados al usuario deben expresar procedencia cuando ésta cambie la interpretación.

**Verificación:** para cada tarjeta financiera o conductual crítica un revisor puede rastrear valor → componente origen → entrada o proveedor → prueba.

## 7. Principio IV — Vyra: asistencia, análisis, escenarios y recomendaciones responsables

### 7.1 Capacidades permitidas

Vyra **PUEDE**, cuando existan datos y capacidades reales para respaldarlo:

- explicar conceptos y acontecimientos financieros;
- analizar series históricas y tendencias de activos, incluidas acciones y criptoactivos;
- ofrecer líneas de tiempo y visualizaciones retrospectivas o prospectivas, debidamente etiquetadas;
- estudiar señales de tendencia, volatilidad y riesgo;
- formular escenarios futuros y estimaciones probabilísticas;
- comparar estrategias y sus consecuencias simuladas;
- relacionar alternativas con objetivos, horizonte y perfil de riesgo del usuario;
- recomendar **varias opciones razonables**, con ventajas, límites y riesgos;
- señalar concentraciones, discrepancias con el perfil declarado y datos insuficientes;
- vincular situaciones con contenidos educativos de Academy.

### 7.2 Límites obligatorios

1. Una predicción debe indicar **horizonte temporal, fecha o período de datos, método o fuente, supuestos materiales e incertidumbre**. Nunca se declara una dirección futura como certeza.
2. Si el método no permite asignar probabilidades calibradas, Vyra **NO DEBE inventar porcentajes de probabilidad**. Puede emplear escenarios cualitativos honestamente delimitados.
3. Toda proyección debe distinguir **dato histórico** de **escenario futuro**. Una línea futura nunca se dibujará como continuación observada sin identificarla como proyección o simulación.
4. Cuando existan alternativas pertinentes, Vyra debe favorecer una comparación plural —por ejemplo, mantener, reducir parcialmente, vender o esperar información— en lugar de una instrucción única e imperativa.
5. El perfil de riesgo es contexto, **no garantía de idoneidad ni autorización legal automática**. Recomendaciones individualizadas sujetas a regulación sólo se habilitarán después de revisar el marco jurídico, autorizaciones, controles y responsabilidades aplicables.
6. La Alpha académica podrá demostrar análisis y comparaciones simuladas. **No presentará sus salidas como asesoría de inversión real ni simulará tener validación predictiva que no existe.**
7. Vyra no puede crear saldos, posiciones, precios, puntajes, indicadores o transacciones a partir de texto libre como si fueran hechos verificados. Esos valores proceden de los sistemas correspondientes.
8. La recomendación nunca activa una orden sin una acción específica, informada y confirmada del usuario y sin los controles propios del caso.

**Contrato conceptual:** `Datos con proveniencia → cálculo/análisis validado → contexto estructurado → Vyra → explicación con límites`.

**Verificación:** evaluaciones adversariales deben comprobar que Vyra no promete rendimientos, no fabrica probabilidades y sabe decir “no hay datos suficientes”.

## 8. Principio V — Inteligencia conductual sin diagnóstico psicológico

1. Nuvyra puede estudiar eventos observables, patrones temporales y cambios respecto a referencias definidas para detectar **situaciones que podrían merecer una pausa o explicación adicional**.
2. Un aumento de clics, una serie de cancelaciones o una navegación repetida pueden indicar una desviación de interacción, **no prueban pánico, desesperación, miedo, ansiedad, adicción o incapacidad**.
3. Los puntajes conductuales deben definir escala, interpretación, entradas, período de observación y limitaciones. `78/100` no significa `78 % de pánico`.
4. Se priorizará una línea base personal cuando exista evidencia suficiente; cuando no exista, el sistema indicará `baseline insuficiente` o empleará una referencia no personal identificada explícitamente, si está aprobada por spec.
5. No se construirán perfiles psicológicos ocultos ni etiquetas clínicas a partir de telemetría.
6. Las señales conductuales no deben utilizarse para explotar vulnerabilidades, presionar operaciones, encarecer servicios de forma oportunista ni segmentar al usuario con fines manipulativos.
7. El sistema debe permitir evaluar falsos positivos, falsos negativos y sesgos relevantes antes de escalar su uso.

**Verificación:** casos de prueba con comportamientos intensos pero legítimos no generan afirmaciones emocionales, y la interfaz diferencia observación de interpretación.

## 9. Principio VI — Intervenciones proporcionadas y opción de continuar

1. Una intervención deberá ser **proporcional, comprensible, contextual y limitada en frecuencia**. No se repetirá de forma hostigante por la misma intención sin nueva información material.
2. Puede incluir una pausa breve de reflexión, escenarios, información de riesgos o invitación a repasar contenido, pero no castigos, mensajes culpabilizantes ni obstáculos artificialmente difíciles.
3. Ante una operación válida, debe existir una opción visible de **continuar con la decisión** después de completar cualquier pausa expresamente prevista y justificada por la spec.
4. Los límites por razones no conductuales —seguridad, fraude, saldo, validaciones técnicas o normativa— se documentarán por separado y no se disfrazarán como sugerencias de Vyra.
5. Se medirá la utilidad de las intervenciones sin asumir que “más cancelaciones” o “menos operaciones” equivale automáticamente a mejores decisiones.

**Verificación:** test de flujo demuestra salida clara, ausencia de bucles de avisos y continuidad tras la pausa configurada.

## 10. Principio VII — Control del usuario sobre asistencia de IA y Behavioral Assistance

1. El usuario debe poder conocer si utiliza asistencia de IA generativa, Behavioral Assistance o ambas. **No son necesariamente el mismo control**, y su tratamiento debe ser claro.
2. Debe existir una forma comprensible de **desactivar y reactivar** las funciones opcionales de asistencia, cuando estén disponibles. Desactivar asistencia conductual implica detener su recolección opcional para ese fin, salvo registros mínimos imprescindibles para seguridad, integridad o cumplimiento aplicable, distinguidos expresamente.
3. El diseño deseado para desactivar Behavioral Assistance incluye **una confirmación informativa con cuenta regresiva de 10 segundos** que explique qué retroalimentación se perderá. Esta pausa no debe ser un patrón oscuro: debe ser accesible, ocurrir una sola vez por intento, no reiniciarse arbitrariamente y concluir con una opción clara para confirmar la desactivación.
4. La pausa de diez segundos se establece como **comportamiento de producto sujeto a pruebas de accesibilidad, usabilidad y revisión de privacidad**; si provoca coerción, imposibilidad de ejercer un derecho o incumplimiento legal, prevalece el derecho del usuario y se ajusta o elimina la pausa.
5. Desactivar la función no debe eliminar automáticamente datos históricos ni implicar consentimiento para usos alternativos. Las opciones de eliminación y conservación se rigen por políticas explícitas.
6. El sistema debe evitar afirmar que una función está desactivada si sigue ejecutando de manera oculta su telemetría opcional o sus intervenciones.

**Verificación:** tests prueban que el ajuste persiste, que el aviso se presenta correctamente, que no se muestran intervenciones desactivadas y que cesa la captación opcional correspondiente.

## 11. Principio VIII — Privacidad, consentimiento y ciclo de vida de datos

1. Todo dato recolectado debe responder a un propósito explícito y documentado: funcionalidad, seguridad, investigación consentida u otro uso legítimo aprobado.
2. Se exige minimización: no recolectar movimientos detallados, pulsaciones de teclado, texto libre, credenciales o eventos altamente sensibles cuando métricas agregadas basten.
3. La captura de telemetría conductual opcional debe contar con información comprensible y base apropiada; cuando corresponda, consentimiento explícito y revocable.
4. El diseño debe especificar acceso, almacenamiento, protección, período de retención y eliminación o anonimización. No existe permiso indefinido para guardar datos “por si sirven”.
5. Debe distinguirse la información de usuarios reales de los datos sintéticos de demostración. Para November Alpha se prefieren cuentas y eventos ficticios.
6. Los registros y herramientas de depuración no deben exponer secretos, contraseñas, tokens o datos personales innecesarios.
7. Un cambio de finalidad —por ejemplo, entrenar modelos con sesiones recogidas para otra función— requiere nueva evaluación y autorización apropiada, no una inferencia automática de consentimiento.
8. Los datos personales y de interacción jamás deben venderse o compartirse de forma no autorizada para manipulación financiera.

**Verificación:** cada nueva categoría de datos tiene finalidad, clasificación, retención, controles de acceso y comportamiento de opt-out documentados antes de su captación fuera de pruebas puramente sintéticas.

## 12. Principio IX — Recompensas alineadas con aprendizaje, no compulsión

1. VyraPoints y otras recompensas deben reforzar aprendizaje, comprensión, reflexión, finalización de ejercicios y prácticas educativas responsables.
2. No deben premiar primariamente el volumen, frecuencia, monto o riesgo de operaciones, ni incentivar compras impulsivas para mantener rachas.
3. La paciencia puede reconocerse como práctica reflexiva o habilidad educativa, **no como mandato universal de mantener activos aunque cambien las circunstancias**.
4. Las métricas de éxito no se reducirán al número de transacciones o al tiempo de pantalla. Deben considerar aprendizaje, claridad, confianza informada, utilidad percibida y retención saludable.

**Verificación:** cada regla de puntos incluye una justificación educativa y pruebas que evitan recompensas por operaciones repetitivas sin valor formativo.

## 13. Principio X — Integridad arquitectónica y sistemas de autoridad

1. Nuvyra conserva un **monolito modular** mientras sea apropiado. Un cambio a microservicios requiere evidencia de necesidad y ADR aprobado.
2. Las reglas financieras autoritativas pertenecen a módulos de dominio/aplicación adecuados; no se duplican en UI, controladores o prompts.
3. Las responsabilidades de Identity, Investor Profile, Market, Portfolio, Trading, Behavioral, Vyra, Academy y otros módulos deben ser comprensibles aunque su estructura física evolucione.
4. Behavioral Intelligence calcula o evalúa señales; Vyra las comunica y contextualiza. No se considera válido que el LLM invente el puntaje porque “suena razonable”.
5. Se prefieren interfaces para proveedores reemplazables cuando existe una necesidad concreta —por ejemplo, un proveedor simulado frente a uno real—, evitando abstracción prematura.
6. Las operaciones que modifican estado deben preservar invariantes, transaccionalidad adecuada, validación y trazabilidad.
7. La arquitectura debe respetar las implementaciones existentes: ningún agente debe reestructurar carpetas o introducir dependencias masivas sin un plan y aprobación.

**Verificación:** tests de arquitectura y revisiones de PR buscan dependencias cruzadas injustificadas, lógica financiera duplicada y violaciones de límites.

## 14. Principio XI — Fallos seguros y degradación explícita

1. Ante datos ausentes, vencidos, contradictorios o inválidos, no se inventan valores ni se completan cálculos como si fueran exactos.
2. Si faltan inputs esenciales para una operación o estimación, la acción que depende de ellos debe detenerse de forma segura con explicación. Esto no equivale a bloquear al usuario por una inferencia conductual.
3. Si faltan datos conductuales o baseline, el sistema puede continuar el flujo válido **sin afirmar una anomalía no calculada**.
4. Si falla Vyra, el motor financiero y la simulación deberían continuar donde puedan funcionar de modo independiente; ofrecer una explicación determinista o estado no disponible es preferible a fingir respuesta de un modelo.
5. El sistema debe diferenciar errores técnicos, información no disponible, límites del modelo y decisiones no permitidas por normas o validación.
6. Las excepciones, reintentos e idempotencia se definirán según el riesgo de cada caso, especialmente para órdenes, aunque sean simuladas.

**Verificación:** casos de prueba cubren mercado no disponible, baseline ausente, proveedor de IA caído, petición duplicada y fallo de persistencia sin corrupción de saldo.

## 15. Principio XII — Calidad, claridad y accesibilidad

1. Una funcionalidad significativa se considera terminada sólo cuando cumple criterios de aceptación y evidencia de validación suficiente, además de compilar.
2. La UI debe explicar conceptos financieros para principiantes sin ocultar precisión. El lenguaje sencillo no justifica distorsionar riesgos.
3. Información importante no depende sólo del color, sonido, animación o gestos ocultos. Se priorizan contraste, etiquetas, foco visible, navegación por teclado y mensajes entendibles según el alcance de cada entrega.
4. Las pausas, temporizadores y animaciones no deben impedir el uso accesible; sus alternativas deben definirse en la spec correspondiente.
5. La experiencia debe funcionar en los tamaños y plataformas declarados por la spec, sin prometer compatibilidad universal no comprobada.
6. Los errores deben orientar al usuario y no revelar secretos ni detalles internos innecesarios.

**Verificación:** checklist UX y pruebas funcionales del flujo principal en escritorio y al menos una resolución móvil objetivo.

## 16. Principio XIII — Seguridad por diseño y cumplimiento gradual

1. No se suben secretos, contraseñas, llaves privadas ni tokens al repositorio.
2. Las entradas no confiables se validan. El frontend no es fuente autoritativa de saldos, órdenes, permisos o reglas financieras.
3. Se aplican controles de acceso apropiados, gestión responsable de sesiones, separación de entornos, registros sin secretos y revisión de dependencias.
4. La Alpha local puede usar identidades y datos ficticios; no se justifican atajos inseguros que luego puedan pasar silenciosamente a producción.
5. El aumento de alcance hacia usuarios externos, dinero real, información bancaria o ejecución financiera exige revisión específica de seguridad, privacidad, cumplimiento y operaciones.
6. Un prototipo académico no debe proclamarse plataforma autorizada para recibir o custodiar inversiones reales.

**Verificación:** revisión de secretos y permisos, pruebas de validación relevantes y checklist de seguridad antes de cualquier beta externa.

## 17. Principio XIV — SDD Spec-Anchored y fuente de verdad de requisitos

1. La metodología oficial es **Spec-Anchored SDD**: especificaciones y comportamiento implementado deben mantenerse sincronizados.
2. Para una feature significativa, el flujo normal es: **idea → `spec.md` → clarificación → aprobación humana → `plan.md` → revisión/aprobación humana → `tasks.md` → implementación → tests → validación → revisión spec/código → PR → `main`**.
3. Las specs deben expresar el **qué y por qué**; los planes, el **cómo**; las tareas, unidades verificables; los tests, evidencia contra requisitos.
4. Se recomienda EARS cuando reduzca ambigüedad: `WHEN ... THE SYSTEM SHALL ...`, `WHILE ...`, `WHERE ...`, `IF ... THEN ...`. No se usa como ritual si perjudica la claridad.
5. Requisitos críticos reciben identificadores estables, como `REQ-BS-001`. Las tareas y pruebas referencian esos IDs. El renombrado no debe destruir trazabilidad.
6. Un agente no debe escribir implementación de negocio significativo cuando aún existen preguntas críticas sobre requisitos, privacidad, seguridad o comportamiento.
7. Un cambio de comportamiento exige actualizar spec y pruebas; un refactor sin cambio observable requiere verificar que la spec sigue describiendo lo existente.
8. Las specs deben ser tan pequeñas como permita un entendimiento completo. SDD no justifica documentación redundante o ceremonias excesivas.
9. Se prefiere la incorporación incremental al código existente frente a reconstrucciones completas.

**Verificación:** PR significativo señala spec, requisitos afectados, tareas, tests ejecutados y desviaciones pendientes.

## 18. Principio XV — Codex y agentes bajo control humano

1. `AGENTS.md` debe instruir a Codex y agentes compatibles a leer Constitución, spec, plan, tareas y código relacionado antes de implementar.
2. Codex puede inspeccionar, proponer, especificar, cuestionar, planificar, desarrollar, probar y generar evidencia, pero no asume la autoridad final del fundador.
3. Los agentes no pueden modificar esta Constitución, aprobar su propia excepción ni ampliar autónomamente el alcance de la Alpha.
4. Deben favorecer el **menor cambio correcto**, evitar refactors ajenos, no introducir costos y reconocer límites de sus verificaciones.
5. La clarificación debe buscar contradicciones, requisitos no testeables, fallos seguros, privacidad, accesibilidad, riesgos regulatorios y estados límite antes de planificar.
6. Las tareas paralelas o subagentes pueden acelerar el trabajo sólo si sus límites de propiedad están claros y el resultado se integra y revisa.
7. Si una instrucción del usuario contradice la Constitución, el agente debe explicar el conflicto y pedir una decisión humana sobre corregir la tarea o proponer una reforma, sin ignorar leyes o controles superiores.
8. Ningún agente declarará una funcionalidad «probada» si no ejecutó las pruebas o no cuenta con evidencia verificable; debe informar bloqueos y pruebas no ejecutadas.

**Verificación:** `AGENTS.md`, plantillas y PR checklist remiten a esta Constitución; los reportes de agentes declaran pruebas realizadas y pendientes.

## 19. Principio XVI — Auditoría y evidencia de producto

1. Las decisiones técnicas importantes deben registrarse de modo recuperable mediante specs, ADR, PR o documentación equivalente.
2. Para intervenciones relevantes se debería poder reconstruir, con minimización de datos, qué regla o modelo se utilizó, qué contexto estaba disponible y qué alternativa se mostró.
3. Los registros de auditoría no son autorización para guardar conversaciones o telemetría sin límites; se aplican controles de privacidad y retención.
4. Las afirmaciones sobre efectividad de Behavioral Intelligence, aciertos predictivos o aprendizaje del usuario deben apoyarse en evaluaciones reales, no anécdotas presentadas como evidencia científica.
5. Las métricas simuladas para exposición deben etiquetarse como tales; nunca deben confundirse con resultados de testers reales.

**Verificación:** una revisión puede conectar requisitos críticos con pruebas y distinguir datos sintéticos de experimentos reales.

## 20. Principio XVII — Evolución responsable del producto

1. Nuvyra podrá ampliar progresivamente servicios, modelos, fuentes de datos e integraciones, manteniendo la misión de **Invest + Learn + Vyra**.
2. Antes de incorporar predicción de inversión en un contexto real, deberá definirse evaluación de calidad, cobertura, incertidumbre, rendimiento fuera de muestra, monitoreo, comunicación al usuario y revisión regulatoria pertinente.
3. Las decisiones de producto se apoyarán cuando sea posible en pruebas con usuarios, investigaciones y medidas de aprendizaje, no sólo en entusiasmo técnico.
4. Ningún diferenciador potencial —incluido Behavioral Intelligence— justifica afirmar superioridad científica o exactitud sin evidencia.
5. El crecimiento o monetización no debe convertir a Nuvyra en un sistema de presión para operar con mayor frecuencia.

**Verificación:** nuevas capacidades de alto riesgo tienen criterios de evaluación previos y límites claramente publicados en sus specs.

## 21. Excepciones, reformas y gobernanza

### 21.1 Excepciones

Una excepción temporal sólo se admite cuando no infringe ley, autonomía, veracidad o protección fundamental del usuario. Requiere: principio afectado, necesidad, alcance, riesgo, mitigación, fecha de revisión/caducidad, responsable y aprobación humana registrada. El agente puede proponerla, nunca autorizarla.

### 21.2 Cambios constitucionales

Cada reforma debe incluir versión anterior y nueva, fecha, motivo, secciones alteradas, impacto estimado sobre código/specs, y aprobación humana explícita. Registro recomendado: `docs/constitution/CHANGELOG.md`.

Versión semántica:

- **PATCH:** precisión editorial sin modificar la obligación.
- **MINOR:** nuevo principio o ampliación compatible.
- **MAJOR:** cambio fundamental de autoridad, límites o política.

Una nueva Constitución no invalida mágicamente código anterior: exige plan de revisión y migración para violaciones identificadas. Nada autoriza a ocultarlas.

### 21.3 Revisión periódica

Se revisará al concluir November Alpha y antes de cualquier despliegue público o integración financiera real. La permanencia de principios no significa inmovilidad; significa cambios deliberados y trazables.

## 22. Anexo normativo A — November Alpha 2026

**Estado:** activo sólo para la entrega académica prevista.  
**Fecha objetivo:** 30 de noviembre de 2026.  
**Presupuesto incremental de infraestructura y servicios obligatorios:** **$0 MXN**.
**Entorno:** local; el recorrido central debe ser offline-capable.

### A.1 Qué excluye el presupuesto

No se contabilizan computadoras ya disponibles, electricidad ya cubierta, conexión existente, esfuerzo del equipo ni herramientas gratuitas con licencias adecuadas. **No se aprobarán servicios de pago obligatorios ni dependencias que generen cargos inadvertidos.**

### A.2 Experiencia central de demostración

`Onboarding → perfil del inversionista → Academy → mercado simulado → compra virtual → portafolio → evento de mercado simulado → señales conductuales permitidas → Before Selling → Vyra y comparación de escenarios → decisión del usuario → Decision Journal → aprendizaje`.

El flujo es una **meta de alcance**, no una declaración de que todas sus partes ya existen. Las specs y el repositorio determinarán el trabajo real.

### A.3 Principios técnicos

- Reutilizar ASP.NET Core, React, TypeScript y arquitectura existente donde sea apropiado.
- Preferir PostgreSQL local cuando la especificación de persistencia esté aprobada.
- Usar proveedor de mercado simulado claramente identificado.
- Usar reglas y cálculos deterministas para las señales de la demo; no presentar un modelo inexistente como ML entrenado.
- `DemoVyraProvider` determinista es aceptable; un LLM local es opcional, no requisito.
- Escenarios y datos de demostración reproducibles y sintéticos.
- Capacidad de completar la presentación sin Internet, tras preparación local.
- No habilitar compraventa real, custodia, depósitos, retiros, KYC productivo ni asesoría regulada.

### A.4 Congelamiento de alcance

`SPEC-000` definirá el alcance operativo y los criterios de aceptación. Durante la última semana de noviembre, el equipo debe priorizar corrección, estabilidad, accesibilidad, UX, tests y ensayo de demo por encima de nuevas funciones. Cualquier ampliación crítica requiere justificación y aprobación humana.

### A.5 Qué demuestra la Alpha

Demuestra una **hipótesis de producto integrada** y una arquitectura explicable, no precisión predictiva validada, efectividad clínica, superioridad de inversión ni preparación para custodiar dinero real.

## 23. Checklist constitucional de PR / feature

### Autoridad y producto
- [ ] No contradice esta Constitución ni normas externas aplicables.
- [ ] La spec aprobada define propósito, alcance y criterios de aceptación.
- [ ] El usuario conserva la decisión final donde corresponde.
- [ ] No se generan presiones manipulativas ni incentivos a operar compulsivamente.

### Datos y finanzas
- [ ] Simulaciones, proyecciones y datos reales están distinguidos.
- [ ] Cada cifra crítica tiene proveniencia rastreable.
- [ ] El sistema no promete rendimientos ni presenta incertidumbre como certeza.
- [ ] Los cálculos críticos proceden de componentes adecuados y tienen tests.

### Vyra y Behavioral Intelligence
- [ ] Vyra usa contexto verificable y reconoce falta de datos.
- [ ] Las recomendaciones muestran alternativas y no activan operaciones.
- [ ] Las predicciones identifican horizonte, método/supuestos y límites.
- [ ] Las señales conductuales no se presentan como diagnósticos.
- [ ] Las intervenciones permiten continuar y no hostigan.
- [ ] Los ajustes de asistencia y su desactivación se respetan.

### Privacidad y seguridad
- [ ] Cada nueva categoría de datos tiene finalidad justificada.
- [ ] Consentimiento/base de tratamiento, retención y eliminación están definidos cuando aplica.
- [ ] No hay secretos ni datos personales innecesarios en repositorio o logs.
- [ ] Fallos y datos incompletos se manejan de forma segura.

### Calidad y SDD
- [ ] Requisitos → plan → tareas → código → pruebas son rastreables.
- [ ] No hay ambigüedades críticas abiertas.
- [ ] Build y tests pertinentes fueron ejecutados o se documentó por qué no.
- [ ] Los flujos relevantes fueron revisados en accesibilidad y claridad.
- [ ] `main` continúa demostrable.

### November Alpha, mientras esté vigente
- [ ] Sin costo incremental obligatorio.
- [ ] Sin dependencia de Internet para el recorrido central.
- [ ] Datos simulados claramente etiquetados.
- [ ] Demo reproducible sin servicios externos.

## 24. Criterio final de identidad

Cuando una decisión sea difícil, Nuvyra debe elegir la alternativa que mejor preserve simultáneamente:

1. **Comprensión:** ayudar a entender inversiones, escenarios y consecuencias.
2. **Autonomía:** ofrecer acompañamiento sin apropiarse de decisiones.
3. **Rigor:** diferenciar hechos, cálculos, hipótesis y predicciones.
4. **Transparencia:** explicar el origen de los datos y reconocer incertidumbre.
5. **Respeto conductual:** detectar patrones sin afirmar que se conocen estados mentales.
6. **Aprendizaje:** convertir decisiones y resultados en conocimiento, no en presión para operar.
7. **Ingeniería responsable:** construir con specs, pruebas, revisión y capacidad de evolucionar.

> **Nuvyra ayuda a invertir y a aprender. Vyra ayuda a comprender lo que ocurre y las alternativas disponibles. La inteligencia puede orientar; la decisión pertenece al usuario.**

---

**Fin de Nuvyra Constitution v0.2.0 — aprobada y vigente desde 2026-11-03.**


