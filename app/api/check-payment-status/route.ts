import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Handle GET requests
export async function GET(request: Request) {
  try {
    // Extract email from query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Fetch user data from Supabase
    const { data, error } = await supabase
      .from("users")
      .select("payment_status")
      .eq("email", email)
      .single();

    if (error || !data) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return payment status
    return NextResponse.json(
      { payment_status: data.payment_status ? "success" : "failed" },
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
