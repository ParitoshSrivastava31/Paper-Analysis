import React from "react";
import Head from "next/head";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Head>
        <title>Privacy Policy - Paper Analysis</title>
        <meta
          name="description"
          content="Privacy Policy for Paper Analysis Service"
        />
      </Head>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 mt-28 text-center text-gray-800">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Last Updated: 06/03/2025
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <p className="mb-4">
              At Paper Analysis, one of our main priorities is the privacy of
              our visitors. This Privacy Policy document contains types of
              information that is collected and recorded by Paper Analysis and
              how we use it.
            </p>
            <p className="mb-4">
              If you have additional questions or require more information about
              our Privacy Policy, do not hesitate to contact us at{" "}
              <a
                href="mailto:ai@paperanalysis.com"
                className="text-blue-600 hover:underline"
              >
                ai@paperanalysis.com
              </a>
              .
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Scope</h3>
            <p className="mb-4">
              This Privacy Policy applies only to our online activities and is
              valid for visitors to our website with regards to the information
              that they shared and/or collected on www.paperanalysis.com. This
              policy is not applicable to any information collected offline or
              via channels other than this website.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Consent</h3>
            <p className="mb-4">
              By using our website, you hereby consent to our Privacy Policy and
              agree to its terms.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Information We Collect
            </h3>
            <p className="mb-4">We may collect personal information such as:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Email address</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              How We Use Your Information
            </h3>
            <ul className="list-disc pl-6">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>
                Develop new products, services, features, and functionality
              </li>
              <li>Communicate with you for customer service and updates</li>
              <li>Send you emails</li>
              <li>Find and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Cookies and Web Beacons
            </h3>
            <p className="mb-4">
              We use cookies to store information including visitors'
              preferences and the pages visited. This helps us optimize user
              experience by customizing web page content based on browser type
              and other information.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">User Rights</h3>
            <h4 className="text-lg font-semibold mb-2">CCPA Privacy Rights</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Request disclosure of personal data collected</li>
              <li>Request deletion of personal data</li>
              <li>Request not to sell personal data</li>
            </ul>

            <h4 className="text-lg font-semibold mb-2">
              GDPR Data Protection Rights
            </h4>
            <ul className="list-disc pl-6">
              <li>Right to access your personal data</li>
              <li>Right to rectification</li>
              <li>Right to erasure</li>
              <li>Right to restrict processing</li>
              <li>Right to object to processing</li>
              <li>Right to data portability</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Children's Information
            </h3>
            <p className="mb-4">
              Paper Analysis does not knowingly collect any Personal
              Identifiable Information from children under the age of 13. If you
              believe your child has provided such information, please contact
              us immediately.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, you can
              contact us:
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

export default PrivacyPolicy;
