import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuth } from "@clerk/nextjs/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Handle GET requests
export async function GET(request: NextRequest) {
  // 1. Authenticate the user via Clerk
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Fetch the user's payment status by Clerk user ID
    const { data, error } = await supabase
      .from("users")
      .select("payment_status")
      .eq("clerk_user_id", userId)
      .single();

    if (error || !data) {
      console.error("User fetch error:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Return a simplified success/failed status
    //    If you store exact strings like "success" or "failed",
    //    you can map them directly; otherwise adjust as needed.
    return NextResponse.json(
      {
        payment_status:
          data.payment_status === "success" ? "success" : "failed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
