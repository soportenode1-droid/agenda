-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "ReminderKind" AS ENUM ('HOURS_24', 'HOURS_1');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventType" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "bufferBeforeMinutes" INTEGER NOT NULL DEFAULT 0,
    "bufferAfterMinutes" INTEGER NOT NULL DEFAULT 0,
    "minimumNoticeHours" INTEGER NOT NULL DEFAULT 24,
    "maximumHorizonDays" INTEGER NOT NULL DEFAULT 60,
    "dailyBookingLimit" INTEGER,
    "priceCents" INTEGER,
    "currency" VARCHAR(3),
    "color" TEXT NOT NULL DEFAULT '#1D5BFF',
    "customQuestions" JSONB NOT NULL DEFAULT '[]',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityRule" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DateOverride" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "intervals" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DateOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "eventTypeId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "inviteeName" TEXT NOT NULL,
    "inviteeEmail" TEXT NOT NULL,
    "inviteePhone" TEXT,
    "inviteeNotes" TEXT,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "startUtc" TIMESTAMP(3) NOT NULL,
    "endUtc" TIMESTAMP(3) NOT NULL,
    "inviteeTimezone" TEXT NOT NULL,
    "cancelToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "googleEventId" TEXT,
    "googleMeetUrl" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarConnection" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "googleAccountEmail" TEXT NOT NULL,
    "encryptedAccessToken" TEXT NOT NULL,
    "encryptedRefreshToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3),
    "selectedCalendarIds" JSONB NOT NULL DEFAULT '[]',
    "targetCalendarId" TEXT,
    "syncToken" TEXT,
    "watchChannelId" TEXT,
    "watchResourceId" TEXT,
    "watchExpiresAt" TIMESTAMP(3),
    "requiresReconnection" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReminderJob" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "kind" "ReminderKind" NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReminderJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_slug_key" ON "EventType"("slug");

-- CreateIndex
CREATE INDEX "EventType_hostId_active_idx" ON "EventType"("hostId", "active");

-- CreateIndex
CREATE INDEX "AvailabilityRule_hostId_weekday_idx" ON "AvailabilityRule"("hostId", "weekday");

-- CreateIndex
CREATE INDEX "DateOverride_hostId_date_idx" ON "DateOverride"("hostId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DateOverride_hostId_date_key" ON "DateOverride"("hostId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_cancelToken_key" ON "Booking"("cancelToken");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_idempotencyKey_key" ON "Booking"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_googleEventId_key" ON "Booking"("googleEventId");

-- CreateIndex
CREATE INDEX "Booking_hostId_startUtc_endUtc_idx" ON "Booking"("hostId", "startUtc", "endUtc");

-- CreateIndex
CREATE INDEX "Booking_eventTypeId_startUtc_idx" ON "Booking"("eventTypeId", "startUtc");

-- CreateIndex
CREATE INDEX "Booking_status_startUtc_idx" ON "Booking"("status", "startUtc");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_hostId_startUtc_key" ON "Booking"("hostId", "startUtc");

-- CreateIndex
CREATE INDEX "CalendarConnection_hostId_requiresReconnection_idx" ON "CalendarConnection"("hostId", "requiresReconnection");

-- CreateIndex
CREATE INDEX "CalendarConnection_watchExpiresAt_idx" ON "CalendarConnection"("watchExpiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarConnection_hostId_googleAccountEmail_key" ON "CalendarConnection"("hostId", "googleAccountEmail");

-- CreateIndex
CREATE INDEX "ReminderJob_status_scheduledFor_idx" ON "ReminderJob"("status", "scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderJob_bookingId_kind_key" ON "ReminderJob"("bookingId", "kind");

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityRule" ADD CONSTRAINT "AvailabilityRule_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateOverride" ADD CONSTRAINT "DateOverride_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarConnection" ADD CONSTRAINT "CalendarConnection_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderJob" ADD CONSTRAINT "ReminderJob_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
