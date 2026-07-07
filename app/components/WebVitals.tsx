"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // In production, you might want to send these metrics to your analytics service
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vitals] ${metric.name}: ${Math.round(metric.value)}`);
    }
  });

  return null;
}
