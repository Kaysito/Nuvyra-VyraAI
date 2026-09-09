# Nuvyra

Nuvyra es un laboratorio de decisiones financieras: permite practicar con dinero virtual y reconocer impulsos como FOMO y venta de pánico antes de actuar.

> Nuvyra conserva el alma y los aprendizajes de KairosAI, no su deuda técnica. Este repositorio es un rewrite limpio desde cero.

## Primera experiencia demostrable

1. Evaluar experiencia, tolerancia al riesgo y riesgo conductual por separado.
2. Comprar un activo con saldo virtual.
3. Simular una caída intensa del mercado.
4. Activar **Antes de vender**, una intervención explicable que no bloquea al usuario.
5. Registrar la decisión para construir aprendizaje posterior.

## Arquitectura

- ASP.NET Core 10 y C# para la API.
- React, TypeScript y Vite para la web responsiva.
- Monolito modular: `Domain`, `Application`, `Infrastructure`, `Contracts` y `Api`.
- PostgreSQL será la única fuente de verdad al incorporar persistencia.
- Redis queda fuera del MVP; se añadirá solo ante una necesidad medida de caché, rate limiting o coordinación efímera.
- La IA explicará señales calculadas por el sistema; no será el motor contable ni tomará decisiones por el usuario.

## Ejecutar backend

Abre `Nuvyra.slnx` en Visual Studio Community, selecciona `Nuvyra.Api` como proyecto de inicio y ejecuta. También puedes usar:

```powershell
dotnet run --project src/Nuvyra.Api
```

La API incluye datos en memoria deliberadamente para la demo. Reiniciar el proceso restablece el portafolio virtual.

Las verificaciones del dominio no requieren paquetes externos:

```powershell
dotnet run --project tests/Nuvyra.UnitTests
```

## Ejecutar frontend

Requiere Node.js con npm:

```powershell
cd apps/web
npm install
npm run dev
```

## Organización de equipo sugerida

- Persona 1: flujo web, responsive y narrativa de demo.
- Persona 2: dominio, casos de uso y pruebas.
- Persona 3: API, persistencia PostgreSQL y datos de mercado.
- Persona 4: investigación conductual, contenido, QA y guion de presentación.

Consultar `docs/architecture` antes de introducir nuevas bases de datos, servicios o proveedores externos.

## Colaboración

Antes de comenzar una tarea, lee [CONTRIBUTING.md](CONTRIBUTING.md) y [docs/team-workflow.md](docs/team-workflow.md). `main` permanece presentable y todo trabajo se realiza en ramas cortas mediante pull request.
