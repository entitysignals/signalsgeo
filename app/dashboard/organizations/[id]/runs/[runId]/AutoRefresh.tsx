"use client";

import { useEffect } from "react";

export function AutoRefresh({ 
  status, 
  hasScore 
}: { 
  status: string;
  hasScore: boolean;
}) {
  useEffect(() => {
    // Keep refreshing until status is "done" AND we have a score
    const shouldRefresh = 
      status === "queued" || 
      status === "running" || 
      (status === "done" && !hasScore);

    if (shouldRefresh) {
      const interval = setInterval(() => {
        // Hard reload to bypass cache
        window.location.reload();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [status, hasScore]);

  return null;
}
