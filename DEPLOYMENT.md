# Despliegue de agenda NODE: Cloudflare + Neon

La landing existente permanece en `nodeq.com.mx`. Esta aplicación se desplegará como Cloudflare Worker en `agenda.nodeq.com.mx`.

## 1. Neon

1. Crear un proyecto PostgreSQL en Neon, preferentemente en una región de Norteamérica.
2. Copiar su cadena de conexión **pooled** y guardarla como secreto `DATABASE_URL` de Cloudflare. No pegarla en el repositorio.
3. Con la misma variable en local, ejecutar `pnpm db:migrate` y `pnpm db:seed`.

## 2. Cloudflare Workers

1. Instalar dependencias con `pnpm install`.
2. Iniciar sesión con `pnpm exec wrangler login`.
3. Añadir secretos, sin escribirlos en archivos: `pnpm exec wrangler secret put DATABASE_URL` y repetir para los secretos definidos en `.env.example`.
4. Probar el Worker con `pnpm preview` y publicar con `pnpm deploy`.

## 3. Dominio y Cloudflare

1. En Cloudflare Workers, añadir el dominio personalizado `agenda.nodeq.com.mx`.
2. Como el DNS también está en Cloudflare, el registro se crea y verifica desde el mismo panel.
3. Establecer `NEXT_PUBLIC_APP_URL=https://agenda.nodeq.com.mx` como variable/secreto del Worker.

## 4. Antes de producción

- Configurar credenciales OAuth de Google con las URL finales.
- Añadir Turnstile, Resend y el secreto de cron.
- Aplicar migraciones a Neon y probar una reserva completa.
- Cambiar los CTA de la landing a `https://agenda.nodeq.com.mx/reservar`.

No se debe publicar el subdominio como agenda funcional hasta completar las fases de interfaz y Calendar.
