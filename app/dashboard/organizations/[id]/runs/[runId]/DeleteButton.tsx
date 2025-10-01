"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ runId, orgId }: { runId: string; orgId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Delete button clicked! Proceeding without confirmation...");
    
    // Skip confirmation for now due to browser blocking
    setIsDeleting(true);

    try {
      console.log("Calling DELETE API...");
      const response = await fetch(`/api/runs/${runId}/delete`, {
        method: "DELETE",
      });

      console.log("API response:", response.status, response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error("Failed to delete");
      }

      console.log("Delete successful, redirecting...");
      // Redirect to organization page
      router.push(`/dashboard/organizations/${orgId}`);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete scan: " + error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative z-50"
      style={{ pointerEvents: 'auto' }}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}

