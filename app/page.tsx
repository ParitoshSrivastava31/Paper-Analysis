// "use client";

// import React, { useState } from "react";
// import Navbar from "@/components/Navbar";
// import { AuroraBackground } from "@/components/ui/aurora-background";
// import { Hero } from "@/components/Hero";
// import { Features } from "@/components/Features";
// import LogoTicker from "@/components/LogoTicker";
// import Pricing from "@/components/Pricing";
// import { Faq } from "@/components/Faq";
// import Footer from "@/components/Footer";

// export default function Home() {
//   return (
//     <>
//       <AuroraBackground>
//         <Navbar />
//         <Hero />
//         <LogoTicker />
//         <Features />
//         <Pricing />
//         <Faq />
//         <Footer />
//       </AuroraBackground>
//     </>
//   );
// }

// app/home/page.tsx (or app/page.tsx)
"use client";

import React from "react";
import { Hero } from "@/components/Hero";
import LogoTicker from "@/components/LogoTicker";
import { Features } from "@/components/Features";
import Pricing from "@/components/Pricing";
import { Faq } from "@/components/Faq";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoTicker />
      <Features />
      <Pricing />
      <Faq />
    </>
  );
}
