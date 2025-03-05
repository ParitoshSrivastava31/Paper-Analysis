import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Set is_paid to false for this user
    await supabase.from("users").update({ is_paid: false }).eq("email", email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting one-time:", error);
    return NextResponse.json(
      { error: "Failed to reset one-time" },
      { status: 500 }
    );
  }
}
