# Seguridad en Nuvyra

Nuvyra es una demo educativa. No procesa órdenes reales ni debe recibir claves privadas,
tokens de exchange o datos financieros sensibles.

## Reportar una vulnerabilidad

No publiques detalles explotables en issues. Contacta a los mantenedores del repositorio
de forma privada con los pasos para reproducir, impacto y una corrección sugerida.

## Controles actuales

- CodeQL y auditoría de dependencias se ejecutan en GitHub Actions.
- Gitleaks revisa el historial de cada push y pull request.
- Las credenciales se entregan mediante secretos del entorno, nunca desde el código.
- Los fallos de API exponen códigos y `traceId`, pero no stack traces ni secretos.
