"use client";

import { DateTime } from "luxon";
import { useMemo, useState } from "react";

type Service = {
  id: "diagnostico" | "sesion";
  title: string;
  duration: string;
  description: string;
};

const services: Service[] = [
  {
    id: "diagnostico",
    title: "Llamada de diagnóstico",
    duration: "30 min",
    description: "Una primera conversación para entender el reto y definir el siguiente paso.",
  },
  {
    id: "sesion",
    title: "Sesión estratégica",
    duration: "60 min",
    description: "Una sesión de trabajo para explorar prioridades, solución y plan de acción.",
  },
];

const slots = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"];

export default function BookingPage() {
  const visitorZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Mexico_City",
    [],
  );
  const [selectedService, setSelectedService] = useState<Service>(services[0]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const today = DateTime.now().setZone(visitorZone).startOf("day");
  const days = Array.from({ length: 7 }, (_, index) => today.plus({ days: index }));

  return (
    <main className="booking-shell">
      <a className="brand" href="/" aria-label="Volver a NODE">
        NODE<span>/</span> AGENDA
      </a>

      <header className="booking-header">
        <p className="eyebrow">Reserva una conversación</p>
        <h1>Encuentra un espacio que funcione para ti.</h1>
        <p>
          Los horarios se muestran en tu zona horaria: <strong>{visitorZone}</strong>.
        </p>
      </header>

      <section className="booking-grid" aria-label="Proceso de reserva">
        <div className="booking-panel">
          <p className="step">01 — Servicio</p>
          <div className="service-list">
            {services.map((service) => (
              <button
                className={`service-card ${selectedService.id === service.id ? "is-selected" : ""}`}
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  setSelectedSlot(null);
                }}
                type="button"
              >
                <span>
                  <strong>{service.title}</strong>
                  <small>{service.description}</small>
                </span>
                <b>{service.duration}</b>
              </button>
            ))}
          </div>
        </div>

        <div className="booking-panel">
          <p className="step">02 — Día y horario</p>
          <div className="day-list" role="list" aria-label="Días disponibles">
            {days.map((day, index) => (
              <button
                aria-pressed={selectedDay === index}
                className={selectedDay === index ? "day is-selected" : "day"}
                key={day.toISODate()}
                onClick={() => {
                  setSelectedDay(index);
                  setSelectedSlot(null);
                }}
                type="button"
              >
                <span>{day.toFormat("ccc")}</span>
                <strong>{day.toFormat("dd")}</strong>
              </button>
            ))}
          </div>
          <p className="chosen-date">{days[selectedDay].toLocaleString({ weekday: "long", day: "numeric", month: "long" })}</p>
          <div className="slot-list" aria-live="polite">
            {slots.map((slot) => (
              <button
                className={selectedSlot === slot ? "slot is-selected" : "slot"}
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                type="button"
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <form className="booking-panel booking-form">
          <p className="step">03 — Tus datos</p>
          <p className="selection-summary">
            {selectedSlot
              ? `${selectedService.title} · ${days[selectedDay].toFormat("dd LLL")} · ${selectedSlot}`
              : "Selecciona un horario para continuar."}
          </p>
          <label>
            Nombre completo
            <input autoComplete="name" name="name" placeholder="Tu nombre" required />
          </label>
          <label>
            Email de trabajo
            <input autoComplete="email" name="email" placeholder="tu@empresa.com" required type="email" />
          </label>
          <label>
            ¿En qué podemos ayudarte? <em>Opcional</em>
            <textarea name="notes" placeholder="Cuéntanos brevemente sobre tu reto." rows={3} />
          </label>
          <button className="primary-button" disabled={!selectedSlot} type="button">
            Continuar a confirmación
          </button>
          <small className="form-note">La confirmación con Google Calendar y Meet se habilitará al conectar tu calendario.</small>
        </form>
      </section>
    </main>
  );
}
