import React from "react";
import Head from "next/head";

const RefundPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Head>
        <title>Refund Policy - Paper Analysis</title>
        <meta
          name="description"
          content="Refund Policy for Paper Analysis Service"
        />
      </Head>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 mt-28 text-center text-gray-800">
          Refund Policy
        </h1>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Last Updated: 06/03/2025
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <p className="mb-4">
              At Paper Analysis, all purchases are final, and we do not offer
              refunds under any circumstances. By using our service, you agree
              to this no-refund policy.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">No Refunds</h3>
            <p className="mb-4">
              Due to the nature of our digital services, once a payment is made,
              it is non-refundable. We encourage users to review all details
              before making a purchase.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Exceptions</h3>
            <p className="mb-4">
              The only exceptions to our no-refund policy are cases where a
              payment error occurs due to technical issues on our end. If you
              believe you have been charged incorrectly, please contact us
              immediately.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="mb-4">
              If you have any questions regarding our refund policy, please
              reach out to us at:
            </p>
            <ul className="list-disc pl-6">
              <li>
                By email:{" "}
                <a
                  href="mailto:ai@paperanalysis.com"
                  className="text-blue-600 hover:underline"
                >
                  ai@paperanalysis.com
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
