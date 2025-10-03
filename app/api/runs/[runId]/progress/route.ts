import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { runId: string } }
) {
  try {
    const supabase = await createClient();

    // Get pages count
    const { count: pagesCount } = await supabase
      .from("crawled_pages")
      .select("*", { count: "exact", head: true })
      .eq("run_id", params.runId);

    // Get queries count (answers count gives us total API calls)
    const { count: queriesCount } = await supabase
      .from("answers")
      .select("*", { count: "exact", head: true })
      .eq("run_id", params.runId);

    return NextResponse.json({
      pagesCount: pagesCount || 0,
      queriesCount: queriesCount || 0,
    });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

