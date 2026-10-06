import { site } from "@/content/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a className="wordmark" href="/">
            Mary Granero<span>Etología y convivencia</span>
          </a>
          <p>Comprender. Conectar. Convivir.</p>
          <a className="text-link" href="/#contacto">
            Hablemos
          </a>
        </div>
        <nav className="footer-nav" aria-label="Navegación del pie">
          {site.nav.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
          {site.socials.map((social) => (
            <a
              href={social.url}
              key={social.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {social.name} (nueva pestaña)
            </a>
          ))}
        </nav>
        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} Mary Granero</small>
          <nav aria-label="Información legal">
            <a href="/aviso-legal/">Aviso legal</a>
            <a href="/privacidad/">Privacidad</a>
            <a href="/cookies/">Cookies</a>
          </nav>
          <a href="/#inicio">Volver arriba ↑</a>
        </div>
      </div>
    </footer>
  );
}
