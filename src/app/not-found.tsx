import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container legal-page">
      <p>Página no encontrada</p>
      <h1>Volvamos a encontrarnos.</h1>
      <p>La dirección que has abierto no existe.</p>
      <Link className="button" href="/">
        Volver al inicio
      </Link>
    </div>
  );
}
