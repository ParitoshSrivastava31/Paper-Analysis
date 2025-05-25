"use client";
import { NextPage } from "next";
import Link from 'next/link';

const About: NextPage = () => {
  return (
    <div className="max-w-3xl mx-auto mt-24 p-5 text-black">
      <h1 className="text-[2.5rem] font-bold mb-4 text-center">About Us</h1>
      <p className="text-[1.2rem] leading-relaxed mb-4">
        Welcome to <strong>Paper Analysis</strong>, your ultimate AI-powered
        exam analysis platform designed specifically for students. Our
        innovative web app streamlines exam preparation by allowing you to
        effortlessly upload your exam papers and receive detailed, data-driven
        insights—all in one convenient place.
      </p>
      <p className="text-[1.2rem] leading-relaxed mb-4">
        At Paper Analysis, we know how challenging exam preparation can be.
        That&apos;s why we&apos;ve developed a user-friendly platform that
        consolidates all your study resources, eliminating the need to navigate
        multiple websites. With the ability to upload up to{" "}
        <strong>5 exam papers at once</strong>, you can quickly access
        comprehensive analysis that highlights essential details, saving you
        both time and stress.
      </p>

      <h2 className="text-[1.75rem] mt-8 mb-4">What We Offer</h2>
      <ul className="list-disc pl-5 mb-4">
        <li className="mb-2 leading-relaxed text-[1.2rem]">
          <strong>AI-Powered Analysis:</strong> Our state-of-the-art AI model
          meticulously examines each uploaded paper, offering a deep dive into
          your exam materials.
        </li>
        <li className="mb-2 leading-relaxed text-[1.2rem]">
          <strong>Most Asked Questions:</strong> Identify frequently tested
          questions and topics to focus your revision on what matters most.
        </li>
        <li className="mb-2 leading-relaxed text-[1.2rem]">
          <strong>Repeated Questions Detection:</strong> Spot patterns and
          recurring questions across papers, giving you a competitive edge.
        </li>
        <li className="mb-2 leading-relaxed text-[1.2rem]">
          <strong>Paper Summary:</strong> Get concise overviews that distill key
          information from complex exam papers.
        </li>
        <li className="mb-2 leading-relaxed text-[1.2rem]">
          <strong>Exam Trend Predictions:</strong> Benefit from data-driven
          forecasts on topics most likely to appear in upcoming exams.
        </li>
      </ul>

      <h2 className="text-[1.75rem] mt-8 mb-4">Why Choose Paper Analysis?</h2>
      <ul className="list-disc pl-5 mb-4">
        <li className="mb-2 leading-relaxed text-[1.2rem]">
          <strong>All-in-One Platform:</strong> Access all your exam resources
          in one place—no more switching between websites.
        </li>
        <li className="mb-2 leading-relaxed text-[1.2rem]">
          <strong>Time-Saving:</strong> Our intuitive interface and powerful AI
          allow you to get in-depth analysis quickly and efficiently.
        </li>
        <li className="mb-2 leading-relaxed text-[1.2rem]">
          <strong>Student-Friendly:</strong> We&apos;re designed to work like a
          supportive friend, helping you relax while making your study time more
          productive.
        </li>
        <li className="mb-2 leading-relaxed text-[1.2rem]">
          <strong>Enhanced Exam Prep:</strong> With clear insights and trend
          predictions, you can focus on mastering the topics that will boost
          your academic performance.
        </li>
      </ul>

      <h2 className="text-[1.75rem] mt-8 mb-4">Our Mission</h2>
      <p className="text-[1.2rem] leading-relaxed mb-4">
        At Paper Analysis, our mission is to empower students with innovative
        tools and actionable insights that transform traditional study habits.
        By harnessing the power of cutting-edge AI, we provide personalized
        recommendations and analysis that not only prepare you for exams but
        also build confidence and reduce exam-related stress.
      </p>
      <p className="text-[1.2rem] leading-relaxed mb-4">
        Join thousands of students who have revolutionized their study routines
        with Paper Analysis. Whether you&apos;re preparing for finals,
        competitive exams, or standardized tests, our platform offers the
        resources and insights you need to succeed.
      </p>
      <p className="text-[1.2rem] leading-relaxed mb-4">
        <strong>
          Experience smarter, faster, and more effective exam preparation
          today—because your success is our top priority.
        </strong>
      </p>
      <p className="text-[1.2rem] leading-relaxed mb-4">
        For more details, feel free to contact us or visit our FAQ page. Start
        your journey with Paper Analysis and unlock the secrets to efficient,
        AI-powered exam analysis!
      </p>
      <p className="text-[1.2rem] leading-relaxed mb-4 z-50">
  Checkout <Link href="https://www.careeroadmap.com" className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">
    Careeroadmap.com
  </Link>
</p>

      <footer className="mt-8 pt-4 border-t border-gray-300 text-center text-gray-500 opacity-10 text-[0.2rem]">
        <p>
          Keywords: exam paper analysis, AI exam analysis, upload exam papers,
          exam resources, state-of-the-art AI, study insights, most asked
          questions, repeated questions, exam preparation, student success.
        </p>
      </footer>
    </div>
  );
};

export default About;
