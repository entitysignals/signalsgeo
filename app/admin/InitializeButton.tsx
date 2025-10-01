"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function InitializeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/init-scoring', {
        method: 'POST',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to initialize scoring version');
      }
    } catch (error) {
      alert('Failed to initialize scoring version');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
      <div className="flex justify-between items-center">
        <div className="text-yellow-800">
          ⚠️ No scoring version exists. Initialize the default version to get started.
        </div>
        <button
          onClick={handleInitialize}
          disabled={loading}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Initializing..." : "Initialize v1.0"}
        </button>
      </div>
    </div>
  );
}

