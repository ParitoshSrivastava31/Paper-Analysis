"use client";
import { useState } from "react";
import axios from "axios";
import { IconX } from "@tabler/icons-react";

export default function PaymentOptions({
  email,
  analysisId,
  onClose,
}: {
  email: string | null;
  analysisId: string | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleOneTime = async () => {
    if (!analysisId || !email) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/initiate-one-time", {
        email,
        analysisId,
      });
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error("Error initiating one-time payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/initiate-subscription", {
        email,
      });
      window.location.href = response.data.subscriptionUrl;
    } catch (error) {
      console.error("Error initiating subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
      <div className="bg-white p-6 rounded-2xl relative shadow-lg max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
          title="Close"
        >
          <IconX className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Choose Your Payment Option
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="border border-gray-300 p-4 rounded-2xl cursor-pointer hover:shadow-lg hover:bg-stone-100 transition w-full"
            onClick={handleOneTime}
            disabled={loading}
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              One-Time Analysis
            </h3>
            <p className="text-gray-600">Pay once for this analysis.</p>
            <p className="text-green-600 font-bold text-2xl mt-2">₹19</p>
          </button>
          <button
            className="border border-gray-300 p-4 rounded-2xl cursor-pointer hover:shadow-lg hover:bg-stone-100 transition w-full"
            onClick={handleSubscription}
            disabled={loading}
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-900">
              Subscription
            </h3>
            <p className="text-gray-600">Unlimited analyses for a month.</p>
            <p className="text-green-600 font-bold text-2xl mt-2">₹149/month</p>
          </button>
        </div>
        {loading && <p className="text-center mt-4">Processing...</p>}
      </div>
    </div>
  );
}
