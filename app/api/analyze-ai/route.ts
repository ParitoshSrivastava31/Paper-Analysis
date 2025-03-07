import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuth } from "@clerk/nextjs/server";

// Initialize Supabase with server-side key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  // Authenticate the user
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the user's email, subscription_status, and is_paid from the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, subscription_status, is_paid")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !userData) {
      console.error("User fetch error:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the analysis from the analyses table using the user's email
    const { data: analysisData, error: analysisError } = await supabase
      .from("analyses")
      .select("analysis_text, updated_at")
      .eq("email", userData.email)
      .single();

    if (analysisError) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Determine if analysis is still processing (if analysis_text is null)
    const isProcessing = !analysisData.analysis_text;

    return NextResponse.json({
      analysis: analysisData.analysis_text,
      updatedAt: analysisData.updated_at,
      isPaid: userData.is_paid,
      isProcessing,
      isSubscribed: userData.subscription_status,
      email: userData.email,
    });
  } catch (error: unknown) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { error: "Failed to retrieve analysis" },
      { status: 500 }
    );
  }
}
