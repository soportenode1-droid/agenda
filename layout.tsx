import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NODE | Agenda un diagnóstico",
  description: "Reserva un diagnóstico con la célula de ingeniería y negocio de NODE.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
