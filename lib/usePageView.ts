"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "@/lib/gtag";

export const usePageView = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);
};
