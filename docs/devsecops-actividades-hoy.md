# Actividades de DevSecOps para hoy

Responsable: compañero del bloque 5 — QA, DevOps, seguridad y presentación.
Rama: `chore/demo-readiness`.
Tiempo recomendado: 3 horas y 30 minutos. La entrega debe dejar evidencia; no hace falta instalar toda la matriz institucional.

## 1. Preparar la rama (10 min)

```powershell
git fetch origin
git switch -c chore/demo-readiness origin/main
git status
```

Si la rama ya existe, usar `git switch chore/demo-readiness` y `git pull --ff-only`.

## 2. Validación local (35 min)

```powershell
dotnet restore Nuvyra.slnx
dotnet build Nuvyra.slnx --configuration Release --no-restore
dotnet run --project tests/Nuvyra.UnitTests --configuration Release --no-build --no-restore
npm ci --prefix apps/web
npm run build --prefix apps/web
git diff --check
```

Registrar resultados, versiones de .NET/Node y cualquier fallo reproducible.

## 3. Secretos y dependencias (35 min)

- Confirmar que `.env`, claves, tokens y certificados estén ignorados y no aparezcan en el historial reciente.
- Ejecutar `dotnet list Nuvyra.slnx package --vulnerable --include-transitive`.
- Ejecutar `npm audit --prefix apps/web --audit-level=high`.
- Revisar Dependabot; ninguna actualización se fusiona con CI rojo.
- Si Gitleaks o Semgrep ya están disponibles, ejecutarlos y adjuntar el resumen. No bloquear la entrega por instalar una herramienta nueva sin tiempo para configurarla.

## 4. Workflows y GitHub (35 min)

- Confirmar que CI ejecute backend, pruebas y frontend.
- Confirmar que CodeQL cubra C# y TypeScript/JavaScript.
- Cambiar a `npm ci` en el workflow solo si el lockfile está confirmado y el job pasa.
- Revisar permisos mínimos de Actions: `contents: read`; `security-events: write` solo para CodeQL.
- Verificar protección de `main`: PR obligatorio, checks requeridos, sin push directo y sin force push.
- Revisar `.github/CODEOWNERS` y anotar los usuarios que falten; no inventar nombres.
- Confirmar plantillas de PR, bug y Dependabot.

## 5. QA del recorrido P0 (45 min)

Ejecutar tres recorridos completos desde el navegador, reiniciando el sandbox entre ellos:

1. Pulso → lección → compra virtual → caída → esperar 24 horas.
2. Pulso → compra virtual → caída → revisar evidencia.
3. Pulso → compra virtual → caída → continuar con la venta.

Además, probar saldo insuficiente, cantidad inválida, doble clic, reinicio y respuestas inválidas si el endpoint existe. Registrar hallazgos como bloqueante, alto, medio o bajo con pasos para reproducirlos.

## 6. Evidencia (25 min)

Adjuntar al PR una matriz de casos ejecutados, enlace o captura de CI, resumen de CodeQL/secretos/dependencias, capturas móvil y escritorio, y la lista de pendientes P1: ZAP, RESTler, Stryker, PactNet, Trivy, Cosign, Dockle, Testcontainers y chaos engineering.

## 7. Publicar (20 min)

Usar commits pequeños, por ejemplo `chore(ci): stabilize demo checks`, `chore(security): document baseline scan` y `test(qa): record demo acceptance matrix`.

```powershell
git status
git diff --check
git push -u origin chore/demo-readiness
```

Abrir un PR en borrador hacia `main`; no fusionarlo hoy. Indicar qué pasó, qué falló, qué riesgo queda y qué se revisará el jueves.

## Terminado hoy cuando

- Build y pruebas locales tienen resultado registrado.
- CI y CodeQL están verdes o tienen un fallo documentado con responsable.
- No hay secretos visibles ni dependencias vulnerables de severidad alta sin explicación.
- Se ejecutaron tres recorridos P0 y los hallazgos tienen prioridad.
- Existe un PR en borrador con capturas y pendientes.
