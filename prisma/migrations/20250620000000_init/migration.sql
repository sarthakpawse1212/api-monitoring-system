-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ApiStatus" AS ENUM ('HEALTHY', 'WARNING', 'DOWN');

-- CreateEnum
CREATE TYPE "AlertTone" AS ENUM ('ERROR', 'WARNING', 'INFO');

-- CreateEnum
CREATE TYPE "ChartKind" AS ENUM ('DASHBOARD_RESPONSE_TREND', 'RESPONSE_TREND', 'ERROR_RATE', 'TRAFFIC_DISTRIBUTION');

-- CreateTable
CREATE TABLE "MonitoredApi" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" "ApiStatus" NOT NULL,
    "avgLatencyMs" INTEGER,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL,
    "availabilityPercent" DOUBLE PRECISION,
    "requestsToday" INTEGER,
    "errorCount" INTEGER,
    "trafficSharePercent" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonitoredApi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestLog" (
    "id" TEXT NOT NULL,
    "apiId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "httpMethod" TEXT,
    "path" TEXT NOT NULL,
    "endpoint" TEXT,
    "message" TEXT,
    "statusCode" INTEGER NOT NULL,
    "statusLabel" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "apiId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "tone" "AlertTone" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartDataPoint" (
    "id" TEXT NOT NULL,
    "apiId" TEXT,
    "chartKind" "ChartKind" NOT NULL,
    "label" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "ChartDataPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonitoredApi_slug_key" ON "MonitoredApi"("slug");

-- CreateIndex
CREATE INDEX "RequestLog_occurredAt_idx" ON "RequestLog"("occurredAt");

-- CreateIndex
CREATE INDEX "RequestLog_apiId_occurredAt_idx" ON "RequestLog"("apiId", "occurredAt");

-- CreateIndex
CREATE INDEX "RequestLog_statusCode_idx" ON "RequestLog"("statusCode");

-- CreateIndex
CREATE INDEX "ChartDataPoint_chartKind_apiId_sequence_idx" ON "ChartDataPoint"("chartKind", "apiId", "sequence");

-- AddForeignKey
ALTER TABLE "RequestLog" ADD CONSTRAINT "RequestLog_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "MonitoredApi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "MonitoredApi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartDataPoint" ADD CONSTRAINT "ChartDataPoint_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "MonitoredApi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
