import React from "react";
import Head from "next/head";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Head>
        <title>Terms and Conditions - Paper Analysis</title>
        <meta
          name="description"
          content="Terms and Conditions for Paper Analysis Service"
        />
      </Head>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold m-6 mt-28 text-center text-gray-800">
          Terms and Conditions
        </h1>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Last Updated: 06/03/2025
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h3 className="text-xl font-semibold mb-4">Acknowledgment</h3>
            <p className="mb-4">
              These are the Terms and Conditions governing the use of this
              Service and the agreement that operates between you and the
              Company. These Terms and Conditions set out the rights and
              obligations of all users regarding the use of the Service.
            </p>
            <p className="mb-4">
              Your access to and use of the Service is conditioned on your
              acceptance of and compliance with these Terms and Conditions.
              These Terms and Conditions apply to all visitors, users, and
              others who access or use the Service.
            </p>
            <p className="mb-4">
              By accessing or using the Service you agree to be bound by these
              Terms and Conditions. If you disagree with any part of these Terms
              and Conditions, then you may not access the Service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">User Accounts</h3>
            <p className="mb-4">
              When you create an account with us, you must provide us with
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in the immediate termination of your account.
            </p>
            <p className="mb-4">
              You are responsible for safeguarding the password that you use to
              access the Service and for any activities or actions under your
              password.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Copyright Policy</h3>
            <p className="mb-4">
              All content, features, and functionality of our services are the
              exclusive property of <strong>Paper Analysis</strong> and are
              protected by international copyright, trademark, and other
              intellectual property laws.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Intellectual Property
            </h3>
            <p className="mb-4">
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of the Company and its
              licensors.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Limitation of Liability
            </h3>
            <p className="mb-4">
              The entire liability of the Company and any of its suppliers under
              any provision of these Terms shall be limited to the amount
              actually paid by you through the Service or 100 USD if you haven't
              purchased anything through the Service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Governing Law</h3>
            <p className="mb-4">
              The laws of <strong>India</strong>, excluding its conflicts of law
              rules, shall govern these Terms and your use of the Service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, you
              can contact us:
            </p>
            <ul className="list-disc pl-6">
              <li>
                By visiting our website:{" "}
                <a
                  href="https://www.paperanalysis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.paperanalysis.com
                </a>
              </li>
              <li>
                By sending us an email:{" "}
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

export default TermsAndConditions;
