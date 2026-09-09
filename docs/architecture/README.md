# Arquitectura de Nuvyra

## Módulos funcionales previstos

- **Identity & Profile:** identidad, experiencia, tolerancia y objetivos.
- **Market Intelligence:** cotizaciones normalizadas y métricas deterministas.
- **Simulation:** efectivo, órdenes y posiciones exclusivamente virtuales.
- **Behavioral Guidance:** señales de presión, intervenciones y decisiones.
- **Learning:** microcontenidos y progreso; fuera del primer corte.
- **Audit:** registro append-only de decisiones importantes.

Cada módulo debe poseer sus reglas y exponer casos de uso. Ningún endpoint debe acceder directamente a una base de datos. Los módulos empiezan dentro del mismo despliegue y podrán extraerse solo cuando exista una razón operativa medida.

## Dependencias permitidas

`Api → Application → Domain`

`Infrastructure → Application + Domain`

`Contracts` contiene únicamente mensajes públicos. `Domain` no conoce frameworks, HTTP, bases de datos ni modelos de IA.

## Evolución prevista

La implementación en memoria es una costura temporal para la demo. El siguiente adaptador será PostgreSQL mediante EF Core. El proveedor de mercado y el proveedor de IA se esconden detrás de interfaces para poder sustituirlos sin alterar el dominio.
