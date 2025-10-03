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

  const crawlProgress = Math.min((pagesCount / urlBudget) * 50, 50);
  const queryProgress = Math.min((queriesCount / 14) * 40, 40);
  const totalProgress = crawlProgress + queryProgress;

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
              {totalProgress < 30 ? "⏱ Estimated time: 3-5 minutes" : 
               totalProgress < 70 ? "⏱ Almost there... 1-2 minutes remaining" : 
               "⏱ Finalizing results..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

