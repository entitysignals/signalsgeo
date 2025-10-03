"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh({ 
  status, 
  hasScore 
}: { 
  status: string;
  hasScore: boolean;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Keep refreshing until status is "done" AND we have a score
    const shouldRefresh = 
      status === "queued" || 
      status === "running" || 
      (status === "done" && !hasScore);

    if (shouldRefresh) {
      const interval = setInterval(() => {
        // Soft refresh using router - prevents progress bar jumping
        router.refresh();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [status, hasScore, router]);

  return null;
}
