import Link from "next/link";
import { site } from "@/content/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link className="wordmark" href="/">
            Mary Granero<span>Etología y convivencia</span>
          </Link>
          <p>Comprender. Conectar. Convivir.</p>
          <Link className="text-link" href="/#contacto">
            Hablemos
          </Link>
        </div>
        <nav className="footer-nav" aria-label="Navegación del pie">
          {site.nav.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
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
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/cookies">Cookies</Link>
          </nav>
          <Link href="/#inicio">Volver arriba ↑</Link>
        </div>
      </div>
    </footer>
  );
}
