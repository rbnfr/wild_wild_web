# Web de Mary Granero

Sitio web profesional de **Mary Granero**, etóloga de perros y gatos: presentación, trayectoria,
libros, redes, colaboraciones y formulario de contacto. Es una aplicación **Next.js** (App Router)
con **TypeScript**, **Tailwind CSS** y un pequeño backend propio para el formulario.

> **Estado del contenido:** los textos, fotos, libros, redes y datos legales son **provisionales**
> (marcados con `TODO`). Nada de lo que aparece sobre la biografía o la trayectoria de Mary es real
> hasta que se rellene. Ejecuta `npm run check:content` para ver qué falta.

---

## 1. Requisitos

- [Node.js 24 LTS](https://nodejs.org/) (o superior). Comprueba con `node --version`.
- npm (viene con Node).
- [Git](https://git-scm.com/).
- Un editor, por ejemplo [VS Code](https://code.visualstudio.com/).

## 2. Primer arranque

```bash
npm install                  # descarga las dependencias
cp .env.example .env.local   # en Windows PowerShell: Copy-Item .env.example .env.local
npm run dev                  # arranca en http://localhost:3000
```

Con la configuración por defecto de `.env.example` el formulario funciona en modo `dry-run`:
**valida todo pero no envía ningún correo**. Es lo ideal para desarrollar.

Para detener el servidor: `Ctrl + C`.

## 3. Variables de entorno

Se definen en `.env.local` (en tu ordenador) y en el panel del hosting (en producción).
**Nunca se suben al repositorio** (`.env.local` está en `.gitignore`).

| Variable                            | ¿Pública?   | Para qué sirve                                                                                         |
| ----------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`              | Sí          | URL del sitio sin barra final (canonical, sitemap, Open Graph). Es un valor de **compilación**.        |
| `ALLOW_INDEXING`                    | No          | `true` para que los buscadores indexen el sitio. Por defecto `false` (robots.txt bloquea y `noindex`). |
| `CONTACT_DELIVERY_MODE`             | No          | `resend` envía el correo; `dry-run` valida pero no envía (desarrollo, pruebas, staging).               |
| `CONTACT_TO_EMAIL`                  | No          | Dirección que recibe los mensajes.                                                                     |
| `CONTACT_FROM_EMAIL`                | No          | Remitente verificado en Resend. Admite `Nombre <correo@dominio.com>`.                                  |
| `RESEND_API_KEY`                    | **Secreta** | Clave de API de [Resend](https://resend.com/).                                                         |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`    | Sí          | Clave pública de [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/).               |
| `TURNSTILE_SECRET_KEY`              | **Secreta** | Clave secreta de Turnstile (solo servidor).                                                            |
| `CONTACT_RATE_LIMIT_MAX`            | No          | Envíos permitidos por IP y ventana (por defecto 5).                                                    |
| `CONTACT_RATE_LIMIT_WINDOW_SECONDS` | No          | Duración de la ventana en segundos (por defecto 600).                                                  |
| `CONTACT_GLOBAL_RATE_LIMIT_MAX`     | No          | Tope global de mensajes enviados por ventana, sumando todas las IP (por defecto 50).                   |
| `TRUSTED_PROXY_HOPS`                | No          | Proxies de confianza delante de la app para leer la IP real (por defecto 1).                           |

Reglas de oro:

- Todo lo que empieza por `NEXT_PUBLIC_` **acaba visible en el navegador**. Jamás pongas ahí un secreto.
- Las variables `NEXT_PUBLIC_*` se incrustan **al compilar**: si las cambias, vuelve a desplegar.
- En producción con `CONTACT_DELIVERY_MODE=resend` son obligatorias `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL`, `RESEND_API_KEY` y `TURNSTILE_SECRET_KEY`. Si falta alguna, el formulario
  responde con un error genérico y el servidor registra **solo el nombre** de la variable que falta.

## 4. Comandos

| Comando                 | Qué hace                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `npm run dev`           | Servidor de desarrollo con recarga automática.                                                                  |
| `npm run build`         | Compila para producción.                                                                                        |
| `npm run start`         | Arranca la versión compilada (tras `npm run build`).                                                            |
| `npm run lint`          | Revisa el código con ESLint.                                                                                    |
| `npm run typecheck`     | Comprueba los tipos de TypeScript.                                                                              |
| `npm run format`        | Da formato al código con Prettier (`format:check` solo comprueba).                                              |
| `npm test`              | Tests unitarios (Vitest).                                                                                       |
| `npm run test:e2e`      | Tests de extremo a extremo y accesibilidad (Playwright).                                                        |
| `npm run check:content` | Lista el contenido provisional (`TODO`). `node scripts/check-content-todos.mjs --strict` falla si queda alguno. |
| `npm run audit:deps`    | Auditoría de dependencias (`npm audit`).                                                                        |
| `npm run verify`        | Lint + tipos + tests + build, todo seguido.                                                                     |

La primera vez que ejecutes los E2E instala el navegador: `npx playwright install chromium`.

## 5. Estructura

```text
src/
  app/                  Rutas (App Router)
    page.tsx            Home: compone las secciones
    layout.tsx          Estructura global, fuentes y metadatos
    privacidad/ aviso-legal/ cookies/   Páginas legales
    api/contact/route.ts   POST /api/contact (formulario)
    robots.ts sitemap.ts icon.svg opengraph-image.tsx ...
  proxy.ts              CSP con nonce por petición
  components/
    layout/             Cabecera, menú móvil, pie
    sections/           Una sección por archivo (hero, sobre, libros…)
    forms/              Formulario, campos, Turnstile
    ui/                 Botón, foto, sección, iconos
  content/              ← TEXTOS EDITABLES (ver sección 6)
  lib/
    validation/         Esquemas Zod y normalización
    security/           CSP, rate limit, IP, Turnstile, lectura segura del cuerpo
    email/              Plantillas y envío (Resend)
    contact/            Lógica de la API de contacto
    config/             Lectura de variables de entorno
    seo/                Metadatos, JSON-LD, URL del sitio
  styles/globals.css    Tokens de diseño (colores, tipografía, radios…)
public/images/          Fotografías
docs/fotografias.md     Guía de fotos y proporciones
tests/e2e/              Tests Playwright
scripts/                Utilidades (check-content-todos)
.github/                CI (GitHub Actions) y Dependabot
```

## 6. Cómo editar el contenido

Todo el contenido vive en `src/content/`. **No hace falta tocar los componentes.**

| Quiero cambiar…                             | Archivo                                          |
| ------------------------------------------- | ------------------------------------------------ |
| Nombre, título SEO y descripción            | `src/content/site.ts` (`identity`, `seo`)        |
| Menú y botón de la cabecera                 | `src/content/site.ts` (`headerNav`, `headerCta`) |
| Titular, CTA y fotos del hero               | `src/content/site.ts` (`hero`)                   |
| Biografía, filosofía y foto de «Sobre Mary» | `src/content/site.ts` (`about`)                  |
| Ámbitos de contacto                         | `src/content/site.ts` (`workAreas`)              |
| Prensa y colaboraciones                     | `src/content/site.ts` (`press`)                  |
| Email, teléfono y ciudad visibles           | `src/content/site.ts` (`contactInfo`)            |
| Trayectoria                                 | `src/content/timeline.ts`                        |
| Libros                                      | `src/content/books.ts`                           |
| Redes sociales                              | `src/content/social.ts`                          |
| Datos y textos legales                      | `src/content/legal.ts`                           |
| Colores, tipografías y espaciados           | `src/styles/globals.css`                         |

Convención: todo texto pendiente empieza por `TODO:` y las entradas de muestra llevan
`placeholder: true`. Cuando sustituyas un `TODO`, quita también `placeholder: true`.

### Cambiar una foto

1. Copia la imagen en `public/images/` (por ejemplo `mary-hero.jpg`).
2. En el archivo de contenido, descomenta `src` y escribe el `alt`:
   `src: '/images/mary-hero.jpg'`.
3. Pon en `width` y `height` las dimensiones reales de la imagen.

Proporciones y tamaños recomendados en [`docs/fotografias.md`](docs/fotografias.md).

### Añadir un libro

En `src/content/books.ts`, copia el bloque de ejemplo dentro del array `books`, cambia el `id` y
rellena **solo datos reales**: título, subtítulo, año, editorial, descripción, ISBN (opcional),
portada y `purchaseLinks`. Borra la entrada de muestra cuando haya libros reales. Si el array
queda vacío, la sección y su enlace del menú desaparecen solos. Los libros reales generan
automáticamente datos estructurados `Book` para buscadores.

### Añadir o quitar una red social

En `src/content/social.ts`:

- **Añadir**: copia un bloque y rellena `url` con el perfil oficial (`https://…`), `handle` y
  `description`. Si la plataforma no existe en el tipo `SocialPlatform` (`src/content/types.ts`),
  añádela.
- **Quitar**: borra su bloque.
- Sin `url`, la tarjeta se muestra como «pendiente» y no es un enlace. Solo las redes con `url`
  aparecen en el pie y en los datos estructurados (`sameAs`).

### Añadir una entrada a la trayectoria

En `src/content/timeline.ts`, añade un objeto con `id`, `period`, `kind` (`formacion`, `hito`,
`proyecto`, `publicacion`, `aparicion`, `colaboracion`), `title` y `description`.

## 7. Cómo probar el formulario

**Sin enviar correo (por defecto):** con `CONTACT_DELIVERY_MODE=dry-run` rellena el formulario y
envíalo. Verás el mensaje de éxito; la terminal muestra una línea de registro **sin el contenido**
del mensaje. Espera unos 3 segundos antes de enviar (hay un tiempo mínimo anti-bots).

**Con Turnstile (claves de prueba oficiales de Cloudflare):**

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Con estas claves la verificación siempre se supera. El script de Turnstile solo se carga cuando
la persona empieza a usar el formulario.

**Con correo real:**

1. Crea una cuenta en [Resend](https://resend.com/), verifica tu dominio y crea una API key.
2. Configura `CONTACT_DELIVERY_MODE=resend`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (del dominio
   verificado), `CONTACT_TO_EMAIL` y las claves de Turnstile.
3. Reinicia el servidor y envía un mensaje.

Los tests automáticos **nunca envían correo real**.

## 8. Tests

```bash
npm test               # unitarios: validación, seguridad, email, SEO, API, contenido
npm run test:e2e       # navegador real: navegación, formulario, teclado, responsive, axe
```

Los E2E construyen la aplicación en modo producción y la prueban en escritorio y móvil
(`playwright.config.ts`). Incluyen comprobaciones de accesibilidad con axe (WCAG 2.2 AA),
ausencia de errores de consola, anchos de 320 a 1920 px y flujo de teclado.

## 9. Despliegue (hosting Node.js, p. ej. Hostinger)

La web es una aplicación Next.js con servidor: necesita un hosting que admita **Node.js**
(no sirve un hosting estático).

1. Sube el repositorio a GitHub y conéctalo al hosting (rama `main`).
2. Configura **Node.js 24**, comando de compilación `npm run build` y de arranque `npm run start`.
3. Define las **variables de entorno** del apartado 3 en el panel del hosting **antes** de
   desplegar (las `NEXT_PUBLIC_*` se incrustan al compilar).
4. Despliega y prueba con el dominio temporal: home, móvil, formulario, correo recibido,
   páginas legales y consola del navegador.
5. Conecta el dominio, comprueba HTTPS y elige una versión canónica (con o sin `www`) y redirige
   la otra. Actualiza `NEXT_PUBLIC_SITE_URL` y vuelve a desplegar.
6. Cuando el contenido sea definitivo, pon `ALLOW_INDEXING=true` y vuelve a desplegar.

### Antes de publicar (checklist)

- [ ] `node scripts/check-content-todos.mjs --strict` sin ningún `TODO`.
- [ ] Fotos reales con `alt` descriptivo.
- [ ] `src/content/legal.ts` con los datos reales y revisado por un profesional (`status: 'reviewed'`).
- [ ] Variables de producción configuradas (`CONTACT_DELIVERY_MODE=resend`, Resend y Turnstile).
- [ ] `NEXT_PUBLIC_SITE_URL` con el dominio final y `ALLOW_INDEXING=true`.
- [ ] Mensaje de prueba recibido en la bandeja de entrada.
- [ ] `npm run verify` y `npm run test:e2e` en verde.

## 10. Seguridad

- **CSP con nonce por petición** (`src/proxy.ts`, `src/lib/security/csp.ts`): sin `unsafe-inline`
  ni `unsafe-eval` en scripts. Por eso todas las páginas se renderizan bajo demanda.
- **Cabeceras**: `Strict-Transport-Security` (producción), `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` y `frame-ancestors 'none'`.
- **Formulario**: validación y normalización en servidor (Zod, campos desconocidos rechazados),
  límite de 16 KB, comprobación del tipo de contenido, honeypot, tiempo mínimo, Cloudflare
  Turnstile y límite de frecuencia por IP. El asunto del correo nunca incluye texto del usuario,
  los datos se escapan en el HTML y los logs no contienen mensajes ni correos.
- **Limitación de frecuencia en memoria**: funciona con una única instancia de Node. Si algún día
  se escala a varias instancias, sustituir por un almacén compartido (Redis).
- **IP real**: se lee de `X-Forwarded-For` contando desde la derecha con `TRUSTED_PROXY_HOPS`.
  Ajusta el valor al número real de proxies que **reescriben** esa cabecera delante de la app
  (con `0` no se confía en ella y todas las peticiones comparten contador). Si el proxy del
  hosting no la reconstruye, un atacante podría rotar su IP; por eso existe además
  `CONTACT_GLOBAL_RATE_LIMIT_MAX`, un tope global que protege tu bandeja de entrada.
- **Secretos**: solo en variables de entorno del servidor. Revisa que ningún `.env*` (salvo
  `.env.example`) se suba a Git.
- **Dependencias**: `package-lock.json` fija las versiones y Dependabot propone actualizaciones.
  `npm audit --omit=dev` (lo desplegado) devuelve **0 vulnerabilidades**. `npm audit` completo
  señala `braces` (ReDoS), una dependencia transitiva **solo de desarrollo** (ESLint) sin versión
  corregida publicada; no se ejecuta en producción ni procesa datos externos.
- **Versiones fijadas a propósito**: TypeScript 6.0 (typescript-eslint aún exige `< 6.1`) y
  ESLint 9 (los plugins de `eslint-config-next` aún no admiten ESLint 10). Dependabot ignora esos
  saltos mayores hasta que haya soporte.

## 11. Privacidad y aspectos legales

- El sitio **no instala cookies de analítica, publicidad ni seguimiento** ni carga embeds de
  terceros, así que no muestra banner de cookies. Si se añade analítica, publicidad o embeds
  que instalen cookies, hay que pedir consentimiento **antes** de cargarlos.
- Cloudflare Turnstile se carga solo cuando se usa el formulario y está descrito en las políticas.
- El formulario incluye una casilla obligatoria **no premarcada** de aceptación de la política
  de privacidad. Si se quisieran enviar comunicaciones comerciales, haría falta una segunda
  casilla **opcional, separada y no premarcada**.
- Los textos legales de `src/content/legal.ts` son un **borrador técnico**: deben completarse y
  **revisarse por un profesional del derecho** (LSSI-CE, RGPD, LOPDGDD), incluidas las
  transferencias internacionales a proveedores como Resend o Cloudflare.

## 12. Solución de problemas

| Síntoma                                      | Qué mirar                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| El formulario dice «No hemos podido enviar…» | Variables de entorno de producción incompletas; el log del servidor lista cuáles.          |
| El formulario dice «demasiado rápido»        | Es el tiempo mínimo anti-bots; espera 3 segundos y vuelve a enviar.                        |
| El widget de Turnstile no aparece            | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` debía estar definida **al compilar**; vuelve a desplegar. |
| Google no indexa el sitio                    | `ALLOW_INDEXING=true` y redespliegue.                                                      |
| Fallo del build en el hosting                | Ejecuta `npm run verify` en local; versión de Node ≥ 24; variables definidas.              |
| Los E2E no encuentran el navegador           | `npx playwright install chromium`.                                                         |
