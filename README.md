# Mary Granero — versión estática para Hostinger

Esta rama, `static-version`, parte de `main` y reutiliza el diseño y la información de `test-sol6-1`. Conserva retrato, portada, biografía, formación, trayectoria, libro, artículo científico, redes, consultas y contacto. Mantiene la estética, fuentes locales, navegación adaptable, accesibilidad, metadata y datos estructurados.

**Hostinger solo recibe HTML, CSS, JavaScript, imágenes y fuentes. No necesita ejecutar Node.js.** Node.js se utiliza únicamente para generar y comprobar los archivos en tu ordenador o en GitHub Actions.

## Generar el ZIP

Necesitas Node.js 24 LTS. Desde la raíz del proyecto:

```powershell
npm ci
npm run package:static
```

El resultado es **`releases/mary-granero-static.zip`**. Su raíz contiene `index.html`, `.htaccess`, `_next`, `images`, páginas legales, robots, sitemap y licencias. Está listo para extraerse en la raíz del sitio; no contiene el código fuente, `node_modules`, CV, `.docs`, `.git` ni archivos `.env`.

El proceso regenera `out` desde cero para evitar archivos obsoletos, compila y genera las cabeceras de seguridad y verifica la estructura del ZIP. No hagas un ZIP de todo el repositorio para subirlo. Cada cambio de contenido exige volver a generar el paquete.

## Subir a Hostinger Premium

1. Haz una copia de los archivos actuales del sitio si ya existen.
2. En hPanel, abre el administrador de archivos del sitio `marywildbehavior.com` y entra en su carpeta `public_html`.
3. Sube `mary-granero-static.zip` y extráelo directamente en `public_html`. `index.html` debe quedar en esa carpeta, sin un nivel `out` o `mary-granero-static` intermedio. Si el asistente de sitios estáticos acepta el ZIP, selecciona ese mismo paquete.
4. Comprueba que también se haya extraído `.htaccess`; activa la visualización de archivos ocultos si hace falta. Sube el paquete completo de una misma compilación, porque la política CSP contiene los hashes de sus scripts.
5. Retira o aparta la página de bienvenida anterior para que no tenga prioridad sobre el nuevo `index.html`. No borres archivos de otro sitio o aplicaciones que compartan la carpeta.
6. Activa el certificado SSL y fuerza HTTPS desde hPanel. Abre `https://marywildbehavior.com` y prueba también `/privacidad/`, `/aviso-legal/`, `/cookies/`, el menú móvil, imágenes y formulario.

Las instrucciones de carga se basan en el [administrador de archivos oficial de Hostinger](https://www.hostinger.com/support/4548688-basic-actions-in-the-file-manager-in-hostinger/). No se ha realizado ningún despliegue ni modificado tu cuenta de Hostinger.

## Desplegar por Git sin servidor Node

La integración Git para PHP/HTML de Hostinger copia la rama, pero no compila Next.js. Un registro con «Installing Composer dependencies» y «Publishing», sin `npm ci` ni compilación, corresponde a este flujo. **Ni `test-sol6-1` ni el código fuente de `static-version` son ramas listas para publicar directamente.** No contienen `index.html` en la raíz: publicar sus fuentes puede causar 403 cuando el servidor no permite listar directorios.

El trabajo habitual se hace creando una rama desde `static-version` y abriendo un pull request hacia ella. Al hacer merge y subirlo a GitHub, Actions incrementa automáticamente la versión de parche, compila, comprueba la web, actualiza `hostinger-static` y crea un merge real en `main`. Los pushes directos a `static-version` también lanzan el proceso.

El incremento se guarda en `package.json` y `package-lock.json` de la rama fuente mediante un commit del bot, en `version.json` de ambas ramas publicadas y en una etiqueta `vX.Y.Z` que apunta al merge en `main`. El commit del bot lleva `[skip ci]`; el token de GitHub Actions evita nuevas ejecuciones por ese push. Actualiza tu rama local con `git pull --ff-only` antes de empezar el siguiente cambio.

Las comprobaciones de pull requests no publican ni tienen permiso de escritura. La publicación se serializa y usa un push atómico de las tres ramas y la etiqueta, sin force push. Si hay fallos, conflictos, cambios simultáneos o restricciones del repositorio, no se actualiza ninguna rama remota de la publicación. Las ejecuciones ya publicadas o superadas por cambios más recientes no crean otra versión. No modifiques los archivos compilados en `main` o `hostinger-static`.

El workflow declara `contents: write` solo en el job de publicación. Si una protección de ramas impide publicar, el proceso falla y mantiene la versión anterior: debe autorizarse al bot en la configuración del repositorio. No se añaden tokens personales ni contraseñas. GitHub Actions y el despliegue automático de Hostinger son procesos separados: deja Hostinger conectado a `main` y activa sus despliegues automáticos.

Para regenerar un ZIP en local puedes seguir usando `npm run package:static`. El comando `npm run prepare:git` sigue preparando una rama local de archivos compilados, pero el flujo habitual de publicación es el automático. Los scripts de release separan preparación, ensamblado y publicación; esta última está limitada al runner de GitHub Actions.

En Hostinger selecciona **`main`** y la carpeta de destino **`public_html`**, y vuelve a desplegar. En esta integración «Root directory» es el destino de la copia, no la carpeta de salida de una compilación; no pongas `out` esperando que Hostinger la genere. Sigue siendo válida la alternativa de subir el ZIP.

Si existe contenido previo, guarda una copia antes de cambiar el despliegue. Comprueba `public_html/index.html` y `public_html/.htaccess`. No apuntes el servidor a `src` ni habilites el listado de directorios para ocultar el error. Si todavía hay 403 con `/index.html`, consulta los registros y verifica permisos habituales: archivos 644 y carpetas 755, nunca 777.

La revisión del 7 de octubre de 2026 de `marywildbehavior.com` devuelve la página de dominio aparcado de Hostinger, no esta web. Vincula el dominio al sitio correcto en hPanel y comprueba que DNS apunte a la IP que indique ese alojamiento. No cambies DNS basándote en una IP deducida del repositorio. Un dominio aparcado y un 403 en la dirección temporal pueden ser problemas distintos.

Diagnóstico confirmado en `https://lawngreen-mantis-706523.hostingersite.com/` el 7 de octubre de 2026: `/` responde 403, `/index.html` responde 404, mientras `/package.json` y `/public/images/portrait_01.jpg` responden 200. Se ha publicado el código fuente y falta el índice compilado. Tras cambiar la rama, verifica que no hayan quedado carpetas o archivos del despliegue anterior (`src`, `public`, `package.json` o variables de entorno); usa un destino limpio después de guardar una copia si el publicador no retira los archivos antiguos.

Las cuatro nuevas pruebas del generador verifican la raíz del despliegue, conservación de la rama y del índice de trabajo, actualizaciones sin force push y rechazo de archivos privados, cambios sin guardar o una rama ajena. Total actual: 25 pruebas unitarias aprobadas.
Referencias: [Git para sitios PHP/HTML en Hostinger](https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/), [diagnóstico de 403](https://www.hostinger.com/support/1583304-how-to-fix-a-403-forbidden-error/).

## Contacto sin servidor

El formulario valida nombre, email, motivo, mensaje y lectura de privacidad. **Preparar correo** crea un borrador en el dispositivo. Después, el visitante puede abrir su aplicación de correo o copiar el texto y pegarlo en su correo habitual. Si el portapapeles falla, el texto se selecciona para copiarlo manualmente.

No envía peticiones a una API, no guarda datos en el navegador ni necesita Resend, Turnstile o un servicio de formularios. Los campos se conservan y nunca se anuncia un envío realizado. El usuario debe pulsar enviar en su propia aplicación. Si no hay JavaScript, sigue disponible el contacto directo por email.

Un `mailto` largo puede superar los límites de algunas aplicaciones; el borrador completo para copiar siempre se mantiene disponible. La recepción real depende de que el visitante envíe el correo desde su cuenta.

## Probar la exportación exacta

```powershell
npm run build
npm run preview
```

Abre `http://localhost:3000`. Este servidor local sirve únicamente la carpeta `out`, con la CSP del paquete y compresión gzip cuando el navegador la acepta. No ejecuta una aplicación Next.js ni una API. Detén la prueba con Ctrl+C.

Para editar con recarga automática puedes utilizar `npm run dev`; la comprobación final debe hacerse sobre la exportación.

## Contenido y dirección pública

Edita `src/content/site.ts` para los textos, libros, experiencia, redes y contacto. Las imágenes reales permanecen en `public/images`; la compilación crea copias AVIF y WebP en varios tamaños para que cada dispositivo descargue una imagen adecuada. Los originales (unos 105 KB y 27 KB) se conservan. No requiere un optimizador de imágenes en el alojamiento ni servicios externos. Las fuentes también son locales y no hay embeds, analítica ni publicidad.

La compilación utiliza `https://marywildbehavior.com` aunque una `.env.local` anterior contenga localhost. Para cambiar el dominio en PowerShell:

```powershell
$env:NEXT_PUBLIC_SITE_URL = 'https://otro-dominio.example'
npm run package:static
```

Solo se acepta un origen HTTPS público, sin rutas ni credenciales. Está preparada para el dominio raíz, no para instalarse dentro de una subcarpeta.

La indexación sigue desactivada (`site.seo.readyToIndex: false`) para esta prueba y mientras faltan datos jurídicos. Canonical, Open Graph, JSON-LD y sitemap usan el dominio indicado. No se copia ningún secreto al ZIP.

## Seguridad, caché y límites

Cada compilación calcula hashes SHA-256 de los scripts inline y genera `.htaccess` con CSP. Los scripts no requieren `unsafe-inline` ni `unsafe-eval`; los estilos inline se permiten para el framework. Las cabeceras también restringen framing, tipos, referencias y permisos; HSTS se emite solo cuando el alojamiento sirve la petición mediante HTTPS. Se incluyen caché de recursos, compresión y una página 404. Los enlaces usan navegación HTML nativa, sin peticiones de precarga a rutas especiales de Next.js. Las rutas legales son directorios con su propio `index.html`, para funcionar sin reescrituras de una aplicación Node.

Las cabeceras, compresión y caché de producción dependen de que Hostinger aplique los módulos y `.htaccess`. Compruébalas tras subir el ZIP. El servidor local prueba la misma CSP, pero no reproduce el motor Apache/LiteSpeed del alojamiento. HTTPS se configura en Hostinger.

Los textos legales continúan como borradores visibles; se han ajustado al flujo de correo local. Completa titular, datos fiscales, domicilio profesional, derechos y conservación, y revisa las condiciones reales antes de abrir el sitio al público. No se publican domicilio, fecha de nacimiento ni teléfono privados de los CV.

## Comprobaciones

```powershell
npm run lint
npm run typecheck
npm run format:check
npm test
npm run package:static
npm run test:e2e
npm audit
```

Playwright arranca el servidor estático, comprueba navegación, teclado, seis anchuras, accesibilidad con axe, imágenes, CSP, borrador y portapapeles. No envía correos reales. Los informes están en `test-results` y `playwright-report`, excluidos de Git. La compilación debe existir antes de ejecutar las pruebas del navegador y el puerto 3000 debe estar libre.

El workflow de GitHub comprueba la rama, ofrece el ZIP como artefacto y actualiza automáticamente las ramas publicadas. Hostinger sirve `main` cuando aplica su integración Git. La guía paso a paso y el resultado de la revisión local están en `.docs/desplegar_version_estatica.md`.

## Resultado local de esta versión

Revisión del 6 de octubre de 2026: compilación, empaquetado, lint, tipos y formato correctos; **21 pruebas unitarias y 19 de navegador aprobadas**. El ZIP contiene 81 archivos, pesa 957.095 bytes (0,91 MiB) y supera la verificación de integridad y exclusión de archivos privados.

Lighthouse móvil sobre el servidor estático local: rendimiento **93**, accesibilidad **100**, buenas prácticas **100** y SEO **69** con indexación desactivada. LCP: **3,2 s**; CLS: **0**; bloqueo total: **100 ms**. El LCP queda por encima del objetivo orientativo de 2,5 s y debe medirse de nuevo tras desplegar. La revisión local utilizó Node.js 26.5.0; el workflow preparado para Node.js 24 LTS todavía no se ha ejecutado en GitHub.

## Licencia

Código original bajo MIT (`LICENSE`). El nombre, imágenes, portada, publicaciones y marcas conservan sus derechos respectivos. DM Sans y Newsreader mantienen sus licencias SIL OFL; también se incluyen en el ZIP.
