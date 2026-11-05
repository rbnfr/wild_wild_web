import { SocialIcons } from "@/components/social-icons";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <SocialIcons label="Redes sociales" className="footer-socials" />
        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} Mary Granero</small>
          <nav aria-label="Información legal">
            <a href="/aviso-legal/">Aviso legal</a>
            <a href="/privacidad/">Privacidad</a>
            <a href="/cookies/">Cookies</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
