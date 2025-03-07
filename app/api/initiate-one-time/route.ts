import { dodopayments } from "@/lib/dodopayment";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, analysisId } = await request.json(); // Read request body

    if (!email || !analysisId) {
      return NextResponse.json(
        { error: "Missing email or analysis ID" },
        { status: 400 }
      );
    }

    const productId = "pdt_BZv3Cnjf80nYdEyjnWMMq";
    const productWithQuantity = {
      product_id: productId,
      quantity: 1,
    };

    const response = await dodopayments.payments.create({
      billing: {
        city: "",
        country: "IN",
        state: "",
        street: "",
        zipcode: "",
      },
      customer: {
        email,
        name: "", // You might want to ask for the name in the frontend
      },
      payment_link: true,
      product_cart: [productWithQuantity],
      return_url: process.env.NEXT_PUBLIC_ANALYSIS_URL,
    });

    return NextResponse.json({ paymentUrl: response.payment_link });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
