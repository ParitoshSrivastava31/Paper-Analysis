import React, { useState } from "react";
import axios from "axios";
import { Check } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  onClick: () => void;
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  features,
  onClick,
  isPopular = false,
}) => (
  <div className="relative bg-white rounded-lg">
    {isPopular && (
      <div className="absolute -top-4 left-0 right-0 flex justify-center">
        <span className="bg-green-300 text-black px-4 py-1 rounded-xl text-sm font-medium">
          More Popular
        </span>
      </div>
    )}
    <div
      onClick={onClick}
      className={`p-6 rounded-lg  transition-all cursor-pointer flex flex-col h-full ${
        isPopular
          ? "border-blue-200 hover:border-gray-700 shadow-lg border"
          : "border-gray-200 hover:border-gray-500"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-1">{title}</h2>
      <p className="text-gray-600  mb-4">{description}</p>

      <div className="mb-4 flex items-baseline">
        <span className="text-3xl  font-black">₹{price}</span>
      </div>

      <div className="text-gray-600 mb-4">Start with...</div>

      <div className="flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center mb-3">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Pricing: React.FC = () => {
  const { user, isLoaded } = useUser();
  const email = isLoaded ? user?.primaryEmailAddress?.emailAddress : "";
  const [loading, setLoading] = useState(false);

  const handleOneTimeClick = (): void => {
    // Handle one-time payment
    console.log("One-time payment clicked");
  };

  const handleSubscriptionClick = async (): Promise<void> => {
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold my-12 text-center">Pricing</h1>
      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <PricingCard
          title="One-Time"
          description="For quick analysis needs"
          price="19/analysis"
          features={[
            "Single analysis per session",
            "View-only access to analysis",
          ]}
          onClick={handleOneTimeClick}
          isPopular={false}
        />

        <PricingCard
          title="Subscription"
          description="For comprehensive analysis"
          price="149/month"
          features={[
            "Unlimited analysis requests",
            "Downloadable analysis reports",
            "Unlimited file uploads",
          ]}
          onClick={handleSubscriptionClick}
          isPopular={true}
        />
      </div>
    </div>
  );
};

export default Pricing;
