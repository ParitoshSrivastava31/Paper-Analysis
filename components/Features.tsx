import React from "react";
import { Bento } from "./ui/bento";

export const Features = () => {
  return (
    <>
      <h1
        className={`text-3xl mx-8 my-8 font-bold text-center text-neutral-900 dark:text-white`}
      >
        What&apos;s the Secret Sauce? (Spoiler: It&apos;s Not Coffee.)
      </h1>
      <p
        className={`text-neutral-600 mx-8 mb-8 text-center dark:text-neutral-300 max-w-lg`}
      >
        Let AI Do the Heavy Lifting - Spot Trends, Predict Questions, and Free
        Up Time for What Actually Matters.
      </p>
      <Bento />
    </>
  );
};
