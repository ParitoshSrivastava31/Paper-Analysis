import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer
      className=" py-8 px-8 w-full bottom-0 mt-auto"
      style={{ zIndex: 1 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                Paper Analysis
              </span>
            </Link>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link
              href="/terms"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/licenses"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Licenses
            </Link>
            <a
              href="mailto:ai@paperanalysis.com"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Paper Analysis. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
