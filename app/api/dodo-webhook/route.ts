// // app/api/dodo-webhook/route.ts
import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { dodopayments } from "@/lib/dodopayment";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhook = new Webhook(process.env.NEXT_PUBLIC_DODO_WEBHOOK_KEY!);

export async function POST(request: Request) {
  const headersList = await headers();

  try {
    const rawBody = await request.text();
    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };

    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);

    if (payload.data.payload_type === "Subscription") {
      switch (payload.type) {
        case "subscription.active":
          const subscription = await dodopayments.subscriptions.retrieve(
            payload.data.subscription_id
          );

          // Update user's subscription status in Supabase
          await supabase
            .from("users")
            .update({
              subscription_status: true,
              subscription_end_date: subscription.next_billing_date,
              payment_status: "success",
            })
            .eq("email", subscription.customer.email);

          console.log(
            "Subscription updated in Supabase:",
            subscription.customer.email
          );
          break;

        case "subscription.cancelled":
        case "subscription.expired":
          await supabase
            .from("users")
            .update({ subscription_status: false, is_paid: false })
            .eq("email", payload.data.customer.email);

          console.log(
            "Subscription cancelled for:",
            payload.data.customer.email
          );
          break;

        case "subscription.failed":
          await supabase
            .from("users")
            .update({
              subscription_status: false,
              is_paid: false,
              payment_status: "failed",
            })
            .eq("email", payload.data.customer.email);

          console.log("Subscription failed for:", payload.data.customer.email);
          break;

        default:
          break;
      }
    } else if (payload.data.payload_type === "Payment") {
      switch (payload.type) {
        case "payment.succeeded":
          const paymentDataResp = await dodopayments.payments.retrieve(
            payload.data.payment_id
          );

          // Update analysis as paid in Supabase
          await supabase
            .from("users")
            .update({ is_paid: true, payment_status: "success" })
            .eq("email", paymentDataResp.customer.email);

          console.log(
            "Payment updated in Supabase for:",
            paymentDataResp.customer.email
          );
          break;

        case "payment.failed":
          const failedPaymentDataResp = await dodopayments.payments.retrieve(
            payload.data.payment_id
          );

          // Update payment as failed in Supabase
          await supabase
            .from("users")
            .update({
              is_paid: false,
              payment_status: "failed",
            })
            .eq("email", failedPaymentDataResp.customer.email);

          console.log(
            "Payment failed for:",
            failedPaymentDataResp.customer.email
          );
          break;

        default:
          break;
      }
    }

    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return Response.json(
      { message: "Webhook verification failed" },
      { status: 400 }
    );
  }
}
