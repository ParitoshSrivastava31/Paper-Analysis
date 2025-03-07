// app/api/initiate-subscription/route.ts

import { dodopayments } from "@/lib/dodopayment";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json(); // Read request body

    if (!email) {
      return NextResponse.json(
        { error: "Missing email or product ID" },
        { status: 400 }
      );
    }

    const response = await dodopayments.subscriptions.create({
      billing: {
        city: "",
        country: "IN", // Update as needed; ensure you use a valid ISO country code
        state: "",
        street: "",
        zipcode: "",
      },
      customer: {
        email,
        name: "", // Optionally, collect and pass the customer's name from the frontend
      },
      payment_link: true,
      product_id: "pdt_uFknsvzbo2zKEri812Vhf",
      quantity: 1,
      return_url: process.env.NEXT_PUBLIC_ANALYSIS_URL, // Change if needed
    });

    return NextResponse.json({ subscriptionUrl: response.payment_link });
  } catch (error) {
    console.error("Error initiating subscription:", error);
    return NextResponse.json(
      { error: "Failed to initiate subscription" },
      { status: 500 }
    );
  }
}
