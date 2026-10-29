import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-shell">
      <p className="eyebrow">NODE / agenda</p>
      <h1>Diagnóstico de ingeniería y negocio.</h1>
      <p>Reserva una conversación con la célula de NODE.</p>
      <Link href="/reservar">Reservar una cita</Link>
    </main>
  );
}
