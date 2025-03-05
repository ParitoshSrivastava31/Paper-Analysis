// components/Hero.tsx
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export const Hero = () => {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    // Use min-h on small screens and a fixed height on medium/large screens.
    <div className="relative w-full flex flex-col items-center justify-center min-h-[90vh] md:h-[90vh] pt-16 pb-8">
      <h1 className="text-3xl md:text-4xl mt-10 md:mt-40 mx-4 md:mx-20 font-bold text-center text-neutral-900 dark:text-neutral-100">
        What If You Could See the Future of Your Exams?
      </h1>
      <p
        className={`text-base md:text-lg mt-4 mx-4 md:mx-20 text-center text-neutral-500 dark:text-neutral-400`}
      >
        Upload Past Papers. Discover Hidden Trends. Write Smarter. It&apos;s Not
        Magic—It&apos;s AI.
      </p>
      <div className="w-[90%] lg:w-[40%] md:w-[60%] mx-auto px-4 md:px-20 my-8 md:my-12 z-40 border bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-3xl">
        <FileUpload onChange={handleFileUpload} />
      </div>
    </div>
  );
};
