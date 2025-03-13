"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePageView } from "@/lib/usePageView"; // Ensure correct import

export default function PageViewTracker() {
  const pathname = usePathname(); // ✅ Gets current route

  useEffect(() => {
    usePageView(); // ✅ Call it without arguments
  }, [pathname]); // ✅ Runs when pathname changes

  return null;
}
