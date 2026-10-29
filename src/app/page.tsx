import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-shell">
      <p className="eyebrow">NODE / DIAGNÓSTICO</p>
      <h1>Una conversación para acelerar tu operación.</h1>
      <p>Reserva una sesión con el equipo de NODE.</p>
      <Link href="/reservar">Solicitar diagnóstico</Link>
    </main>
  );
}
