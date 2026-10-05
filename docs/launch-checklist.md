# Antes de abrir la web al público

- [ ] Aprobar con Mary el copy y las actividades ofrecidas.
- [ ] Completar biografía, formación, trayectoria, libros y redes con fuentes verificadas.
- [ ] Sustituir fotografías y portadas; conservar autorizaciones y ajustar alt/pies.
- [ ] Completar responsable, NIF, domicilio, correo de derechos, base jurídica y conservación.
- [ ] Revisar textos legales y proveedores con un profesional, incluidos posibles tratamientos internacionales.
- [ ] Revisar qué cookies/servicios añade realmente el hosting; no incorporar un banner vacío.
- [ ] Configurar dominio HTTPS y NEXT_PUBLIC_SITE_URL; reconstruir variables públicas.
- [ ] Configurar Resend, remitente verificado y destinatario real.
- [ ] Configurar claves Turnstile con dominio autorizado, sin pre-clearance.
- [ ] Confirmar las cabeceras del proxy y activar confianza solo cuando las sobrescriba; usar limitador compartido/WAF si hay varias instancias.
- [ ] Repetir lint, tipos, unitarios, build, E2E y auditoría de dependencias.
- [ ] Enviar una prueba real y confirmar que llega al buzón (no basta una respuesta HTTP).
- [ ] Comprobar HTTPS, CSP, HSTS, enlaces, metadata, OG, robots y sitemap en el dominio.
- [ ] Comprobar lectores de pantalla, teclado, zoom y dispositivos reales.
- [ ] Medir rendimiento en producción y monitorizar Web Vitals; las medidas locales no son datos de campo.
- [ ] Activar readyToIndex solo después de quitar los TODO y aprobar el contenido.
- [ ] Definir mantenimiento, actualización de dependencias, atención de solicitudes y conservación/eliminación de mensajes.
