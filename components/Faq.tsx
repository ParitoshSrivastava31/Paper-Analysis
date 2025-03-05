"use client";

import React, { useState } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Do I need to be a tech genius to use Paper Analysis?",
    answer: "Not at all—if you can click a button, you're already winning.",
  },
  {
    question: "What if my exam papers are a total mess?",
    answer:
      "Our AI loves a challenge—upload the chaos and watch the magic happen.",
  },
  {
    question: "Why limit uploads to 5 papers at once?",
    answer: "Even our AI needs a coffee break—5 papers is the sweet spot.",
  },
  {
    question: "How secure is my data?",
    answer: "Very, even we don't store it. Your papers are safe with us.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yep, you're in control. Stay as long as you love us, leave when you don't.",
  },
  {
    question: "How to find previous papers?",
    answer: "Click the resources tab OR just google it.",
  },
];

export const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    console.log("Toggling index:", index); // Debugging
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="max-w-2xl mx-auto p-5 mb-8" style={{ zIndex: 1 }}>
      <h1 className="text-2xl font-bold my-12 justify-center text-center">
        Frequently Asked Questions
      </h1>

      {faqData.map((item, index) => (
        <div key={index} className="py-2 border-b">
          <button
            onClick={() => toggleAccordion(index)}
            className="flex justify-between w-full items-center p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
            aria-expanded={openIndex === index}
          >
            <span className="font-medium text-gray-800">{item.question}</span>
            {openIndex === index ? (
              <IconX className="text-gray-500" size={20} />
            ) : (
              <IconPlus className="text-gray-500" size={20} />
            )}
          </button>

          {/* Fixed Expand & Collapse Animation */}
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              openIndex === index
                ? "max-h-[200px] opacity-100 py-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-3 text-gray-600">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
