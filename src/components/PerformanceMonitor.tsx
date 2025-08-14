"use client";

import { useEffect, useState } from "react";

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const measurePerformance = () => {
      if (typeof window !== "undefined" && window.performance) {
        const perfData = window.performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        if (perfData) {
          const newMetrics: PerformanceMetrics = {
            pageLoadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded:
              perfData.domContentLoadedEventEnd -
              perfData.domContentLoadedEventStart,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
          };

          // Measure First Contentful Paint
          const fcpEntry = performance.getEntriesByName(
            "first-contentful-paint"
          )[0];
          if (fcpEntry) {
            newMetrics.firstContentfulPaint = fcpEntry.startTime;
          }

          // Measure Largest Contentful Paint
          const lcpEntry = performance.getEntriesByName(
            "largest-contentful-paint"
          )[0];
          if (lcpEntry) {
            newMetrics.largestContentfulPaint = lcpEntry.startTime;
          }

          setMetrics(newMetrics);

          // Log performance metrics
          console.group("🚀 Performance Metrics");
          console.log("Page Load Time:", newMetrics.pageLoadTime, "ms");
          console.log("DOM Content Loaded:", newMetrics.domContentLoaded, "ms");
          console.log(
            "First Contentful Paint:",
            newMetrics.firstContentfulPaint,
            "ms"
          );
          console.log(
            "Largest Contentful Paint:",
            newMetrics.largestContentfulPaint,
            "ms"
          );
          console.groupEnd();

          // Show warning if metrics are too high
          if (newMetrics.pageLoadTime > 3000) {
            console.warn(
              "⚠️ Page load time is high:",
              newMetrics.pageLoadTime,
              "ms"
            );
          }
          if (newMetrics.firstContentfulPaint > 2000) {
            console.warn(
              "⚠️ First Contentful Paint is high:",
              newMetrics.firstContentfulPaint,
              "ms"
            );
          }
        }
      }
    };

    // Measure after page load
    if (document.readyState === "complete") {
      measurePerformance();
    } else {
      window.addEventListener("load", measurePerformance);
      return () => window.removeEventListener("load", measurePerformance);
    }
  }, []);

  // Don't render anything in production
  if (process.env.NODE_ENV !== "development" || !metrics) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
        🚀 Performance Metrics
      </div>
      <div>Page Load: {metrics.pageLoadTime}ms</div>
      <div>DOM Ready: {metrics.domContentLoaded}ms</div>
      <div>FCP: {metrics.firstContentfulPaint}ms</div>
      <div>LCP: {metrics.largestContentfulPaint}ms</div>
    </div>
  );
}
