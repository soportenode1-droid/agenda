import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_ALLOWED_EMAILS?.split(",")[0]?.trim() || "admin@node.mx";
  const host = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Equipo NODE" },
  });

  await prisma.eventType.upsert({
    where: { slug: "diagnostico-30" },
    update: {},
    create: {
      hostId: host.id,
      slug: "diagnostico-30",
      name: "Llamada de diagnóstico",
      description: "Una conversación inicial para identificar el cuello de botella prioritario.",
      durationMinutes: 30,
      minimumNoticeHours: 24,
      maximumHorizonDays: 60,
      color: "#1D5BFF",
    },
  });

  await prisma.eventType.upsert({
    where: { slug: "sesion-completa-60" },
    update: {},
    create: {
      hostId: host.id,
      slug: "sesion-completa-60",
      name: "Sesión de diagnóstico completa",
      description: "Una sesión de trabajo para profundizar en el reto y definir el siguiente paso.",
      durationMinutes: 60,
      bufferAfterMinutes: 15,
      minimumNoticeHours: 24,
      maximumHorizonDays: 60,
      color: "#1D5BFF",
    },
  });

  const existingRules = await prisma.availabilityRule.count({ where: { hostId: host.id } });
  if (existingRules === 0) {
    await prisma.availabilityRule.createMany({
      data: [1, 2, 3, 4, 5].flatMap((weekday) => [
        { hostId: host.id, weekday, startMinute: 9 * 60, endMinute: 13 * 60 },
        { hostId: host.id, weekday, startMinute: 14 * 60, endMinute: 18 * 60 },
      ]),
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
