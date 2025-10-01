import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function DELETE(
  request: Request,
  { params }: { params: { runId: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the run to find the org_id
  const { data: run } = await supabase
    .from("runs")
    .select("*, organizations(id, owner_user_id)")
    .eq("id", params.runId)
    .single();

  if (!run || run.organizations?.owner_user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orgId = run.org_id;

  // Delete the run (cascading will handle related data)
  const { error } = await supabase.from("runs").delete().eq("id", params.runId);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

