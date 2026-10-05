# Web de Mary Granero

Resultados y límites de las comprobaciones: [informe de verificación](docs/verification.md).

Web profesional en español para Mary Granero, etóloga especializada en animales de compañía. Incluye landing responsive, páginas legales, contenido editable, formulario con backend, SEO, pruebas y comprobaciones automáticas de GitHub.

**El proyecto funciona localmente, pero los datos biográficos, las fotos, las publicaciones y los textos legales aún requieren información real.** Están marcados como TODO. La indexación está desactivada hasta su revisión. No hay redes, testimonios ni credenciales inventadas.

## Empezar en tu ordenador

Necesitas Node.js **24 LTS**, npm y Git. La referencia de runtime está en `.nvmrc`. Abre una terminal en esta carpeta:

```sh
npm install
```

Para instalaciones posteriores reproducibles, utiliza `npm ci`, que respeta `package-lock.json`. Copia `.env.example` a `.env.local` (puedes hacerlo desde el explorador). Después:

```sh
npm run dev
```

Abre <http://localhost:3000>. Para detener la web, pulsa Ctrl+C en esa terminal.

## Variables de entorno

| Variable                         | Uso                                                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Origen público exacto, sin ruta: `http://localhost:3000` en local; el dominio HTTPS real en producción.    |
| `CONTACT_EMAIL_MODE`             | `mock` para pruebas locales sin correo; `live` para envío real. Producción nunca permite mock.             |
| `RESEND_API_KEY`                 | Clave secreta de Resend, exclusivamente en servidor.                                                       |
| `CONTACT_FROM_EMAIL`             | Remitente autorizado dentro de un dominio verificado en Resend.                                            |
| `CONTACT_TO_EMAIL`               | Correo profesional que recibirá las solicitudes.                                                           |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clave pública del widget Turnstile. Se incorpora al build.                                                 |
| `TURNSTILE_SECRET_KEY`           | Clave secreta de Turnstile para comprobar el token en servidor.                                            |
| `CONTACT_TRUST_PROXY`            | `true` únicamente cuando el proxy del hosting sobrescribe y depura `x-forwarded-for`. Por defecto `false`. |

Nunca subas `.env.local`, claves o mensajes de usuarios a Git. `.env.example` contiene únicamente configuración local y campos vacíos. Las variables `NEXT_PUBLIC_*` son públicas: no pongas secretos en ellas. Los cambios de variables públicas requieren reconstruir la aplicación.

## Editar textos, libros y redes

`src/content/site.ts` concentra nombre, profesión, copy, navegación, áreas de contacto, trayectoria, libros, perfiles, contacto y SEO. Los campos jurídicos también están allí; los párrafos legales están en `src/content/legal.ts`. Conserva información provisional claramente marcada mientras no se verifique.

Para añadir un libro, introduce un objeto en `books` con `title`, `subtitle`, `year`, `publisher`, `description`, `cover`, `links` y, opcionalmente, `isbn`. Ejemplo de estructura, **con datos de ejemplo que debes sustituir y no publicar**:

```ts
{
  title: "TODO: título real",
  subtitle: "TODO: subtítulo real",
  year: 2026, // sustituir por el año verificado
  publisher: "TODO: editorial real",
  description: "TODO: descripción aprobada",
  cover: "/images/libro.webp",
  links: [], // añadir solo enlaces oficiales comprobados
}
```

Se generará una tarjeta y JSON-LD `Book`. No añadas objetos de prueba al sitio público. Las redes se añaden en `socials` con `{ name, description, url }`; elimina el objeto para quitar una red. No se cargan embeds ni rastreadores. Solo introduce enlaces HTTPS oficiales y rutas de imágenes locales; la CSP limita las imágenes al propio sitio.

## Sustituir las fotografías

Guarda las fotografías autorizadas en `public/images/` como WebP o AVIF. Cambia `hero.image`, `hero.imageAlt`, `hero.caption`, `about.image` y `about.caption` en el contenido. Edita el alt del bloque secundario en `src/components/sections.tsx` para describir la foto real. Elimina el TODO de los pies únicamente cuando haya una imagen real.

- Principal: proporción **5:6**, recomendable 1200 × 1440 px, sujeto centrado y espacio para el recorte superior en arco.
- Secundaria: **4:5**, recomendable 960 × 1200 px.
- Portadas: **3:4**, sin deformar; el componente usa `object-fit: contain`.

Los SVG actuales son marcadores gráficos originales con texto «fotografía pendiente». No son fotografías de Mary. La aplicación utiliza `next/image` y tamaños responsivos. Comprueba siempre el encuadre en móvil.

## Probar el formulario

Con `.env.local` copiado, `CONTACT_EMAIL_MODE=mock` y las claves Turnstile vacías, inicia `npm run dev`. Completa nombre, email, motivo, mensaje de al menos 20 caracteres y la casilla de privacidad. Verás **«Prueba local completada. No se ha enviado ningún correo.»**. Este modo no llama a Resend ni a Turnstile y jamás funciona bajo `NODE_ENV=production`.

Para un envío real:

1. Verifica el dominio remitente en [Resend](https://resend.com/docs/api-reference/emails/send-email) y configura su clave, remitente y destinatario.
2. Crea un widget en [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/) para los dominios autorizados. Configura ambas claves; no actives pre-clearance. Para desarrollo utiliza un widget separado.
3. Usa `CONTACT_EMAIL_MODE=live`, configura el origen correcto y reinicia/reconstruye la web.
4. Envía un mensaje de prueba sin datos sensibles y comprueba su llegada. El servidor comprueba token, hostname y acción `contact`.

Sin las credenciales necesarias, el servidor devuelve un error de indisponibilidad: nunca comunica un envío inexistente. Los tests simulan las respuestas de los proveedores y no envían correos reales.

## Comprobaciones

```sh
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm audit
```

`npm run format` aplica el formato. Playwright inicia un servidor de desarrollo aislado con correo mock, prueba navegación, formulario, teclado, seis tamaños y accesibilidad con axe. Las capturas e informes quedan en `test-results/` y `playwright-report/`, ignorados por Git. Cierra un servidor anterior del puerto 3000 antes de ejecutar la suite.

En GitHub, `.github/workflows/ci.yml` ejecuta instalación reproducible, lint, tipos, formato, unitarios, auditoría de dependencias de producción, build y E2E. Dependabot propone actualizaciones. Los materiales originales `.docs` y `.github/skills` siguen excluidos; los workflows y Dependabot sí se incluyen.

## Estructura

```text
src/app/                 páginas, metadata, API y CSS
src/components/          navegación, secciones, formulario y pie
src/content/             contenido editorial y legal
src/lib/contact/         validación, antispam y correo
src/lib/seo.ts           URLs y datos estructurados seguros
src/proxy.ts             CSP con nonce por respuesta
src/assets/fonts/        fuentes locales y sus licencias
public/images/           imágenes y placeholders
tests/unit/              dominio, seguridad, transporte y SEO
tests/e2e/               flujos del navegador y accesibilidad
docs/                    decisiones de diseño y auditoría
```

## Construir y desplegar

Para probar la versión de producción:

```sh
npm run build
npm start
```

Con esa versión arrancada en `localhost:3000` y la configuración local sin claves reales de `.env.example`, abre otra terminal y ejecuta `npm run test:production`. Comprueba hidratación, menú móvil, cabeceras, consola y que producción no simule un correo enviado. No ejecutes esta comprobación contra un servidor público ni con credenciales reales.

Usa un alojamiento **Node.js**, como un plan de Hostinger que admita aplicaciones Next.js; una subida a hosting estático no sirve para esta API. Configura Node.js 24, instalación `npm ci`, build `npm run build`, arranque `npm start`, el puerto que proporcione el hosting y las variables de entorno. Mantén la raíz del repositorio como carpeta de la aplicación. Activa HTTPS en el dominio y prueba las cabeceras y un correo real después del despliegue.

No se ha publicado la web ni configurado una cuenta externa. El checklist de publicación está en `docs/launch-checklist.md`.

## Seguridad y límites

El contacto admite únicamente POST JSON, limita el cuerpo a 16 KiB también al leer el stream, rechaza campos inesperados, valida en servidor, comprueba el origen, usa honeypot y verifica Turnstile antes de enviar. Los emails son texto plano; el asunto procede de valores cerrados. Las claves no llegan al cliente ni se registran mensajes completos.

La limitación es de **5 solicitudes cada 10 minutos**, con hasta 5000 claves, **en memoria por proceso**. Se reinicia al reiniciar el servidor. Sin un proxy de confianza configurado, todos los visitantes comparten un límite conservador. Antes de abrir el formulario al público, confirma qué cabecera sobrescribe tu alojamiento y configura el proxy de forma segura. Si hay varias instancias/serverless, añade un limitador compartido o WAF; el contador actual no es global.

La CSP usa nonces distintos por respuesta, sin `unsafe-inline` para scripts. Las páginas HTML se renderizan dinámicamente para que el nonce coincida. `style-src` permite estilos inline para Next/Image y Turnstile; `unsafe-eval` y conexiones websocket solo se permiten en desarrollo. HSTS se activa en producción; no pruebes un dominio HTTPS real con HTTP después de habilitarlo. Las fuentes se sirven localmente. No se incluyen analítica ni publicidad.

## Antes de publicar

Completa los TODO, revisa con Mary el copy y los servicios, acredita las imágenes, incorpora datos reales y solicita revisión profesional de los textos jurídicos y del tratamiento por proveedores. Configura dominio y envío real. Solo entonces cambia `site.seo.readyToIndex` a `true`: se habilitarán robots e indexación. Sin una URL pública válida no se inventan canonical ni URLs de sitemap.

La validación automática de accesibilidad no sustituye una revisión con lectores de pantalla y personas usuarias. Los objetivos de rendimiento deben medirse también en el alojamiento y con condiciones de red reales.

## Licencia

El código original está bajo **MIT**, véase `LICENSE`. El nombre e imagen de Mary, fotos, portadas, publicaciones y marcas no se licencian con el código. DM Sans y Newsreader conservan sus licencias SIL OFL incluidas en `src/assets/fonts/`.
