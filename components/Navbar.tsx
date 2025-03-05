// export default Navbar;

"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
  mobile?: boolean;
  type: "hash" | "page";
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  active,
  children,
  mobile,
  type,
}) => {
  const baseClasses = "transition-colors block w-full px-4 py-2 rounded-lg";
  const mobileClasses = mobile
    ? "hover:bg-gray-100 dark:hover:bg-neutral-800"
    : "text-gray-600 hover:text-indigo-600 lg:inline-block lg:w-auto lg:px-0 lg:py-0 lg:rounded-none";
  const activeClasses = active ? "text-red-600 font-medium" : "";

  const linkContent = (
    <span className={mobile ? "" : "lg:inline-block"}>{children}</span>
  );

  return type === "page" ? (
    <Link
      href={href}
      className={`${baseClasses} ${mobileClasses} ${activeClasses}`}
    >
      {linkContent}
    </Link>
  ) : (
    <a
      href={href}
      className={`${baseClasses} ${mobileClasses} ${activeClasses}`}
    >
      {linkContent}
    </a>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: { id: string; label: string; type: "page" | "hash" }[] = [
    { id: "resources", label: "Resources", type: "page" },
    { id: "blog", label: "Blog", type: "page" },
    { id: "about", label: "About", type: "page" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mx-auto w-[70%] mt-8 rounded-2xl shadow-sm bg-white dark:bg-black bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60 dark:bg-opacity-60">
      <div className="px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Image
              src="/logo.webp"
              alt="Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="text-xl font-bold text-neutral-700 dark:text-neutral-300">
              Paper Analysis
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" color="#3e9392" />
              ) : (
                <Menu className="h-6 w-6" color="#406971" />
              )}
            </button>
          </div>

          {/* Desktop Navigation & Login */}
          <div className="hidden lg:flex items-center space-x-8 justify-end flex-grow ml-8">
            <div className="flex items-center space-x-8 flex-shrink-0">
              {navLinks.map((link) => (
                <NavLink
                  key={link.id}
                  href={link.type === "page" ? `/${link.id}` : `#${link.id}`}
                  active={link.type === "hash" && activeSection === link.id}
                  type={link.type}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="flex-shrink-0">
              <SignedOut>
                <SignInButton mode="modal">
                  {/* Your custom styled login button remains intact */}
                  <button className="inline-flex animate-shimmer items-center justify-center rounded-3xl border bg-[linear-gradient(110deg,#f8f9fa,45%,#e3eaf5,55%,#f8f9fa)] bg-[length:200%_100%] px-6 py-2 font-medium text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 space-y-4 pb-4 bg-white dark:bg-neutral-900 rounded-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                href={link.type === "page" ? `/${link.id}` : `#${link.id}`}
                active={link.type === "hash" && activeSection === link.id}
                type={link.type}
                mobile
              >
                {link.label}
              </NavLink>
            ))}
            <div>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="inline-flex w-full animate-shimmer items-center justify-center rounded-3xl border bg-[linear-gradient(110deg,#f8f9fa,45%,#e3eaf5,55%,#f8f9fa)] bg-[length:200%_100%] px-6 py-2 font-medium text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
