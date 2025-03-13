//components/PageViewTracker.tsx

// components/PageViewTracker.tsx
"use client";

import { usePageView } from "@/lib/usePageView";

const PageViewTracker = () => {
  usePageView();
  return null;
};

export default PageViewTracker;
