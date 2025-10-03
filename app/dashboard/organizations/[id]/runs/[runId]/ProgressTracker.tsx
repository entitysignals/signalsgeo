"use client";

import { useEffect, useState } from "react";

interface ProgressTrackerProps {
  runId: string;
  status: string;
  initialPages: number;
  initialQueries: number;
  urlBudget: number;
}

export function ProgressTracker({ 
  runId, 
  status, 
  initialPages, 
  initialQueries,
  urlBudget 
}: ProgressTrackerProps) {
  const [pagesCount, setPagesCount] = useState(initialPages);
  const [queriesCount, setQueriesCount] = useState(initialQueries);
  const [currentStep, setCurrentStep] = useState("");

  useEffect(() => {
    if (status !== "queued" && status !== "running") {
      return;
    }

    // Poll for progress every 2 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/runs/${runId}/progress`);
        if (response.ok) {
          const data = await response.json();
          setPagesCount(data.pagesCount || 0);
          setQueriesCount(data.queriesCount || 0);
          
          // Determine current step
          if (data.pagesCount === 0) {
            setCurrentStep("Initializing crawl...");
          } else if (data.pagesCount < urlBudget) {
            setCurrentStep(`Crawling pages (${data.pagesCount}/${urlBudget})...`);
          } else if (data.queriesCount === 0) {
            setCurrentStep("Starting AI analysis...");
          } else if (data.queriesCount < 14) {
            // 7 scenarios × 2 providers = 14 queries
            setCurrentStep(`Querying AI engines (${data.queriesCount}/14)...`);
          } else {
            setCurrentStep("Calculating scores...");
          }
        }
      } catch (error) {
        console.error("Progress fetch error:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runId, status, urlBudget]);

  if (status !== "queued" && status !== "running") {
    return null;
  }

  // Calculate progress more smoothly
  // Crawling: 0-40% (crawling is fast)
  // AI Queries: 40-95% (queries take the longest)
  // Scoring: 95-100% (final calculation)
  let totalProgress = 0;
  
  if (pagesCount < urlBudget) {
    // Crawling phase: 0-40%
    totalProgress = (pagesCount / urlBudget) * 40;
  } else if (queriesCount < 14) {
    // AI query phase: 40-95%
    // Start at 40%, add up to 55% more based on query completion
    totalProgress = 40 + (queriesCount / 14) * 55;
  } else {
    // Scoring/finalizing phase: 95-99%
    totalProgress = 95;
  }
  
  // Cap at 99% until truly done (status will show 100%)
  totalProgress = Math.min(totalProgress, 99);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-blue-900 mb-2">Analysis in Progress</div>
          <div className="text-sm text-blue-700 mb-3">{currentStep}</div>
          
          {/* Progress Bar */}
          <div className="relative w-full bg-blue-100 rounded-full h-3 mb-3 overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${totalProgress}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className={`flex items-center gap-2 ${pagesCount > 0 ? 'text-blue-700 font-semibold' : 'text-blue-400'}`}>
              {pagesCount > 0 ? '✓' : '○'} Crawl Pages
              {pagesCount > 0 && <span className="font-normal">({pagesCount}/{urlBudget})</span>}
            </div>
            <div className={`flex items-center gap-2 ${queriesCount > 0 ? 'text-blue-700 font-semibold' : 'text-blue-400'}`}>
              {queriesCount > 0 ? '✓' : '○'} AI Queries
              {queriesCount > 0 && <span className="font-normal">({queriesCount}/14)</span>}
            </div>
            <div className={`flex items-center gap-2 ${queriesCount >= 14 ? 'text-blue-700 font-semibold' : 'text-blue-400'}`}>
              {queriesCount >= 14 ? '✓' : '○'} Calculate Score
            </div>
            <div className={`flex items-center gap-2 ${status === 'done' ? 'text-blue-700 font-semibold' : 'text-blue-400'}`}>
              {status === 'done' ? '✓' : '○'} Complete
            </div>
          </div>

          {/* Estimated time */}
          {status === "running" && (
            <div className="text-xs text-blue-600 mt-3">
              {totalProgress < 40 ? "⏱ Estimated time: 3-4 minutes" : 
               totalProgress < 70 ? "⏱ Running AI analysis... 2-3 minutes remaining" : 
               totalProgress < 90 ? "⏱ Almost there... less than 1 minute" :
               "⏱ Finalizing results..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

