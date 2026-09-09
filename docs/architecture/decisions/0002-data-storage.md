# ADR 0002: una fuente de verdad

Estado: aceptado.

PostgreSQL será el almacén transaccional y de perfiles. No se usarán simultáneamente MySQL y MongoDB. Redis no almacenará saldos, órdenes ni decisiones permanentes; podrá incorporarse después para caché, límites de peticiones o trabajos efímeros cuando haya evidencia de necesidad.
