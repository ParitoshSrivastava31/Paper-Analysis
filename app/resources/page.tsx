"use client";

import { PinContainer } from "@/components/ui/3d-pin";
import React, { useState } from "react";

// --- Main Resources Component ---
const Resources: React.FC = () => {
  // Define university resource data (name and website)
  const resourcesData: Record<string, { name: string; website: string }[]> = {
    "Universities Exam": [
      { name: "Amity University", website: "https://www.aminotes.com/" },
      {
        name: "Chandigarh University",
        website: "https://www.cbsmohali.org/question-papers",
      },
      { name: "Delhi University", website: "https://www.dudelhi.com/" },
      {
        name: "AKTU",
        website: "https://www.aktuonline.com/",
      },
      {
        name: "Lovely Professional University",
        website: "https://github.com/sauravhathi/lpu-cse",
      },
      {
        name: "Christ University",
        website: "https://databank.christuniversity.in/out.php",
      },
      {
        name: "Manipal",
        website: "https://libportal.manipal.edu/KMC/trail/questionpa.asp",
      },
      {
        name: "Vellore Institute of Technology",
        website: "https://vitpapervault.in/",
      },
      {
        name: "Sharda University",
        website:
          "https://sample-papers.com/sharda-university-greater-noida/papers",
      },
      {
        name: "Jaypee Institute",
        website: "http://ir.juit.ac.in:8080/jspui/handle/123456789/220",
      },
      {
        name: "Galgotias University",
        website:
          "https://sample-papers.com/galgotias-university-greater-noida/papers",
      },
      { name: "Mumbai University", website: "https://muquestionpapers.com/" },
      {
        name: "Integral University",
        website: "https://sample-papers.com/integral-university-lucknow/papers",
      },
    ],
    "Board Exams": [
      {
        name: "CBSE",
        website: "https://www.cbse.gov.in/cbsenew/question-paper.html",
      },
      { name: "UP Board", website: "https://www.upboardonline.com/" },
      {
        name: "Maharastra State Board",
        website:
          "https://www.shiksha.com/boards/articles/last-5-years-question-papers-of-ssc-maharashtra-board-pdf-download-blogId-116719",
      },
      {
        name: "Karnataka Board",
        website: "https://www.karnatakaboard.com/karnataka-board-class-12.html",
      },
      { name: "ICSE", website: "https://www.icseonline.com/" },
      { name: "DBSE", website: "https://www.dbseonline.com/" },
      {
        name: "Gujarat Board",
        website: "https://www.gujaratboardonline.com/",
      },
      { name: "Others", website: "https://www.pyqonline.com/school/" },
    ],
    "Competitive Exams": [
      { name: "JEE", website: "https://www.pyqonline.com/exam/jee/" },
      { name: "NEET", website: "https://www.pyqonline.com/exam/neet/" },
      {
        name: "UPSC",
        website: "https://upsc.gov.in/examinations/previous-question-papers",
      },
      {
        name: "SSC-CGL",
        website:
          "https://www.careerpower.in/ssc-cgl-previous-year-question-paper.html",
      },
      { name: "CAT", website: "https://online.2iim.com/CAT-question-paper/" },
      {
        name: "CLAT",
        website:
          "https://www.lawpreptutorial.com/blog/clat/previous-year-question-papers/",
      },
      {
        name: "GATE",
        website:
          "https://www.geeksforgeeks.org/original-gate-previous-year-question-papers-cse-and-it-gq/",
      },
      {
        name: "NDA",
        website: "https://www.shiksha.com/exams/nda-exam-question-papers",
      },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState<
    "Universities Exam" | "Board Exams" | "Competitive Exams"
  >("Universities Exam");

  return (
    <div className="flex flex-col items-center pt-6 mx-16 mt-32">
      <h1 className="text-4xl font-bold mb-8">Resources</h1>
      <p className="text-lg text-center mb-6">
        Select a category to view the available university resources.
      </p>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2  mb-2 z-10 px-4">
        {(
          ["Universities Exam", "Board Exams", "Competitive Exams"] as const
        ).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`shadow-[inset_0_0_0_2px_#616467] rounded-full tracking-widest uppercase font-bold transition duration-200 px-4 sm:px-8 py-2 ${
              selectedCategory === category
                ? "bg-[#616467] text-white"
                : "bg-transparent text-black hover:bg-[#616467] hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* University Cards Grid */}
      <div className="grid mx-4 sm:mx-0 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4">
        {resourcesData[selectedCategory].map((university, index) => (
          <PinContainer
            key={index}
            title={university.name}
            href={university.website}
          >
            {/* Fixed card dimensions ensure consistent size */}
            <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] md:w-[120px] md:h-[120px] flex items-center justify-center p-4 text-black font-medium text-lg">
              {university.name}
            </div>
          </PinContainer>
        ))}
      </div>
    </div>
  );
};

export default Resources;
