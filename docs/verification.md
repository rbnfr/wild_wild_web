# Verificación — 6 de octubre de 2026

## Actualización con contenido real

Perfil, biografía, formación, trayectoria, libro, artículo científico y redes contrastados con las fuentes recogidas en `docs/content-sources.md`. El usuario confirmó el correo público, la finalización de El Cobijo en 2025, la colaboración actual con Scenio y las consultas online/presenciales y desplazamientos.

Se integraron el retrato y la portada aportados, conservando los originales en `public/images`. Revisados el encuadre del retrato, la portada completa y la distribución en escritorio y móvil. Los CV privados permanecen fuera de los archivos públicos y de Git.

- ESLint, tipos y formato: sin errores.
- Unitarios: 40 pruebas aprobadas.
- Navegador: 17 pruebas aprobadas, incluidos accesibilidad, formulario y seis anchuras entre 320 y 1920 px, sin desbordamiento.
- La prueba de portada desplaza la página hasta el libro y comprueba su carga real mediante el optimizador de imágenes; se comprueba también el retrato, la concordancia del libro con el JSON-LD y el enlace de correo.
- Compilación de producción: correcta. Se regeneró la caché Turbopack tras un fallo de restauración de un archivo de caché; el nuevo build terminó sin errores.

Las capturas actuales están en `test-results/site-layout-fits-a-375px-viewport-chromium/home-375.png` y `test-results/site-layout-fits-a-1440px-viewport-chromium/home-1440.png`. Los resultados son locales e ignorados por Git.

**Los resultados Lighthouse y del smoke test de producción que siguen corresponden al 5 de octubre, antes de incorporar las imágenes y textos reales. No se han vuelto a medir en esta actualización.** Continúan pendientes los datos jurídicos, la configuración y prueba del envío real y las comprobaciones en el alojamiento antes de activar la indexación.

## Verificación inicial — 5 de octubre de 2026

## Evidencia

Aplicación comprobada en Windows, Chromium headless y localhost. Next.js 16.3.8, React 19.3.0. Comprobaciones completas locales con Node.js 26.5.0; adicionalmente, las 40 pruebas unitarias, compilación y servidor de producción se verificaron con **Node.js 24.21.0**. El workflow está configurado con Node.js 24; no se ha ejecutado todavía en GitHub.

| Comprobación                           | Resultado                                                                                                                                       |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| ESLint, TypeScript estricto y Prettier | Sin errores                                                                                                                                     |
| Vitest                                 | 40 pruebas aprobadas en 3 archivos                                                                                                              |
| Playwright                             | 17 pruebas aprobadas                                                                                                                            |
| Responsive                             | Sin overflow a 320, 375, 768, 1024, 1440 y 1920 px                                                                                              |
| axe                                    | Sin infracciones en home, páginas legales, menú móvil y formulario inválido; reglas WCAG 2/2.1/2.2 y comprobación explícita de nombres visibles |
| Teclado                                | Skip link, menú, Escape, restauración de foco y foco en el primer error comprobados                                                             |
| Formulario                             | Validación, error 503, conservación de campos y éxito contra el backend local en modo mock comprobados                                          |
| Proveedores                            | Resend y Turnstile comprobados con mocks: hostname/acción, rechazo, fallo y timeout                                                             |
| Producción                             | Build, páginas, hidratación, menú móvil, CSP, HSTS, consola y rechazo del falso envío sin credenciales comprobados                              |
| Dependencias                           | `npm audit`: 0 vulnerabilidades                                                                                                                 |
| Git                                    | Dependencias, `.next`, secretos, resultados y skills locales excluidos; CI y Dependabot incluidos                                               |

## Lighthouse

Lighthouse **13.5.0**, navegación móvil con simulación estándar, servidor de producción local compilado con Node.js 24. Estas son medidas de laboratorio, no de campo.

| Señal               | Resultado |
| ------------------- | --------- |
| Performance         | 96/100    |
| Accessibility       | 100/100   |
| Best Practices      | 100/100   |
| SEO                 | 69/100    |
| LCP                 | 2,7 s     |
| CLS                 | 0         |
| Total Blocking Time | 70 ms     |

SEO está penalizado por el bloqueo **deliberado** de indexación del contenido provisional (`noindex, nofollow` y `robots.txt`). No debe eliminarse hasta completar y aprobar el contenido. Los restantes avisos de la última auditoría son ese bloqueo y la incompatibilidad de la caché atrás/adelante con respuestas dinámicas `no-store` de Next.js.

**Pendiente de rendimiento:** el LCP móvil medido de 2,7 s supera el objetivo orientativo de 2,5 s. La puntuación agregada no convierte ese objetivo en aprobado. Debe medirse de nuevo con fotografías reales y en el alojamiento: optimizar tamaño/encuadre, tiempos de respuesta y recursos críticos según el resultado. INP y percentiles de usuarios reales no pueden verificarse con esta sesión local.

Se corrigieron los avisos encontrados sobre nombre accesible de la marca y sondeo de generación de código de Zod. El nombre se obtiene del texto visible; la validación usa `jitless` para respetar la CSP. La repetición final ya no muestra esos avisos.

Las capturas finales del servidor de producción están en `test-results/production/desktop.png` y `mobile.png`; las capturas responsive E2E están en las carpetas de cada prueba. El informe bruto está en `test-results/lighthouse.json`. Son artefactos locales ignorados por Git y una nueva ejecución E2E puede limpiarlos.

## Revisión visual y fuente

Capturas de escritorio y móvil revisadas: jerarquía consistente, imágenes sin deformación, sin solapamientos ni recortes de controles. Marcadores fotográficos, portada vacía y TODO identificados. No se incluyeron fotografías simuladas de Mary, títulos, redes, testimonios ni acreditaciones inventadas.

Las cabeceras CSP tienen nonce por respuesta y todas las páginas HTML se renderizan dinámicamente. No se permite `unsafe-eval` en producción. Las claves y datos de contacto no se incluyen en logs; el transporte es texto plano y el asunto usa un motivo cerrado. Límite de 16 KiB comprobado también para cuerpos sin Content-Length, con pruebas de origen y rate limiting.

La cadena vulnerable de `braces` del preset ESLint de Next.js no tenía una versión corregida disponible; se sustituyó el preset por ESLint con TypeScript, React Hooks y JSX Accessibility. La auditoría completa quedó en cero sin forzar un downgrade del framework ni desactivar la validación de certificados TLS.

## Pendientes antes de publicar

- Datos, fotografías y permisos reales, copy y servicios aprobados por Mary.
- Datos jurídicos y revisión profesional de privacidad, proveedores y condiciones reales.
- Credenciales, dominio verificado, widget Turnstile y prueba de llegada de un correo real. No se ha enviado ningún email real ni publicado el sitio.
- Configurar confianza en el proxy solamente tras comprobar sus cabeceras. El rate limiter actual es local por proceso; un despliegue con varias instancias necesita almacenamiento compartido o WAF.
- Verificar HTTPS/cabeceras, rutas, imágenes, metadata y rendimiento en el hosting elegido.
- Revisión humana con lectores de pantalla, zoom y dispositivos reales; axe no demuestra por sí solo conformidad WCAG completa.
- Activar `site.seo.readyToIndex` cuando los TODO hayan sido resueltos.

El checklist operativo está en `docs/launch-checklist.md`.
