"use client";

import { usePageView } from "@/lib/usePageView"; // ✅ Ensure this is the correct path

export default function PageViewTracker() {
  usePageView(); // ✅ Call the hook without assigning it

  return null; // ✅ This component doesn't render anything
}
