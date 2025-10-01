import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: org } = await supabase
    .from("organizations")
    .select("owner_user_id")
    .eq("id", params.id)
    .single();

  if (!org || org.owner_user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete all runs for this organization
  const { error, count } = await supabase
    .from("runs")
    .delete()
    .eq("org_id", params.id);

  if (error) {
    console.error("Batch delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, deleted: count });
}


