"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BatchDeleteButton({ orgId, runIds }: { orgId: string; runIds: string[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBatchDelete = async () => {
    if (runIds.length === 0) {
      alert("No scans to delete");
      return;
    }

    if (!confirm(`Delete all ${runIds.length} scans? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/organizations/${orgId}/delete-all-runs`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      router.refresh();
      alert(`Deleted ${runIds.length} scans successfully`);
    } catch (error) {
      console.error("Batch delete error:", error);
      alert("Failed to delete scans");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleBatchDelete}
      disabled={isDeleting || runIds.length === 0}
      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Deleting..." : `Delete All Scans (${runIds.length})`}
    </button>
  );
}


