// app/api/clerk-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with your service role key for admin privileges.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    console.log("Received webhook event:", JSON.stringify(event, null, 2));

    // Process only user.created events from Clerk
    if (event.type === "user.created") {
      const userData = event.data;
      const { id, email_addresses } = userData; // Clerk user ID and email data
      const email = email_addresses?.[0]?.email_address; // Extract the first email

      if (!email) {
        return NextResponse.json(
          { error: "No email found in Clerk event data" },
          { status: 400 }
        );
      }

      // Upsert the user record using email as the unique key.
      const { error } = await supabaseAdmin.from("users").upsert(
        [
          {
            email, // Stable unique identifier
            clerk_user_id: id, // Latest Clerk user ID
            subscription_status: false,
            is_paid: false,
          },
        ],
        { onConflict: "email" }
      );

      if (error) {
        console.error("Error upserting user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ message: "User record upserted in Supabase" });
    }

    // For events that are not handled, return a simple OK.
    return NextResponse.json({ message: "Webhook received" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
