import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import {
  IconArrowWaveRightUp,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

export const Bento = () => {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
};

const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};

const Skeleton = ({ imagePath }: { imagePath: string }) => (
  <div className="relative flex flex-1 w-full h-full min-h-[10rem] rounded-xl bg-gradient-to-br from-blue-800 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    <Image
      src={imagePath} // Replace with your image path
      alt="Description"
      fill // This makes the image responsive
      className="object-cover rounded-xl "
    />
  </div>
);

const items = [
  {
    title: "IQ Flex Activated",
    description: "You analyze with AI, they struggle with notes—who's winning?",
    header: <Skeleton imagePath="/wall5.webp" />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Multi-Paper Analysis",
    description: "Upload up to 5 question papers.",
    header: <Skeleton imagePath="/wall2.webp" />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Paywall? More Like Smartwall.",
    description:
      "Either subscribe or pay one-time(But hey, it’s still cheaper than a bad grade.)",
    header: <Skeleton imagePath="/wall8.webp" />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Last-Minute Savior",
    description:
      "Forget months of prep? No worries. Our AI pinpoints the most-repeated questions, so you can fake it till you make it (or at least survive the exam).",
    header: <Skeleton imagePath="/wall.webp" />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Sleep Smarter, Not Harder.",
    description: "Burnout is so last season.",
    header: <Skeleton imagePath="/wall3.webp" />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
];
