"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface AnalysisData {
  analysis: any; // Can be a JSON object or raw text
  updatedAt: string;
  isPaid: boolean;
  isProcessing: boolean;
  isSubscribed: boolean;
  email: string;
}

// Helper to extract valid JSON from markdown code blocks
function extractJSON(raw: string): any {
  const regex = /```json\s*([\s\S]*?)\s*```/;
  const match = raw.match(regex);
  let jsonString = raw;
  if (match && match[1]) {
    jsonString = match[1];
  }
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Error parsing JSON:", err);
    return null;
  }
}

// Modern glass-morphism inspired card with blur effect
const GlassCard = ({
  children,
  accentColor = "blue",
}: {
  children: React.ReactNode;
  accentColor?: string;
}) => {
  const gradientMap = {
    blue: "from-blue-500/10 to-indigo-500/5",
    green: "from-emerald-500/10 to-teal-500/5",
    purple: "from-purple-500/10 to-violet-500/5",
    amber: "from-amber-500/10 to-yellow-500/5",
    rose: "from-rose-500/10 to-pink-500/5",
  };

  const borderMap = {
    blue: "border-blue-200/30",
    green: "border-emerald-200/30",
    purple: "border-purple-200/30",
    amber: "border-amber-200/30",
    rose: "border-rose-200/30",
  };

  return (
    <div
      className={`backdrop-blur-md bg-white/80 rounded-2xl p-8 border ${
        borderMap[accentColor as keyof typeof borderMap]
      } 
      shadow-lg bg-gradient-to-br ${
        gradientMap[accentColor as keyof typeof gradientMap]
      }`}
    >
      {children}
    </div>
  );
};

// Chart wrapper component with consistent styling
const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm">
    <h3 className="text-xl font-medium mb-4 text-gray-800">{title}</h3>
    {children}
  </div>
);

// Tag component for recurring topics and other tag displays
const Tag = ({ text, color = "blue" }: { text: string; color?: string }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm border ${
        colorMap[color as keyof typeof colorMap]
      } font-medium`}
    >
      {text}
    </span>
  );
};

// Modern PaperCard that shows analysis details with animated appearance
const PaperCard = ({ paper, index }: { paper: any; index: number }) => {
  // For visual variety, alternate accent colors based on index
  const accentColors = ["blue", "purple", "green", "amber", "rose"];
  const accentColor = accentColors[index % accentColors.length];

  // Chart data for topic distribution
  const topicDistributionData =
    paper.topicDistribution && paper.topicDistribution.topics
      ? {
          labels: paper.topicDistribution.topics.map((t: any) => t.name),
          datasets: [
            {
              data: paper.topicDistribution.topics.map(
                (t: any) => t.questionCount
              ),
              backgroundColor: [
                "rgba(99, 102, 241, 0.8)", // Indigo
                "rgba(16, 185, 129, 0.8)", // Emerald
                "rgba(245, 158, 11, 0.8)", // Amber
                "rgba(239, 68, 68, 0.8)", // Red
                "rgba(59, 130, 246, 0.8)", // Blue
                "rgba(139, 92, 246, 0.8)", // Purple
                "rgba(236, 72, 153, 0.8)", // Pink
                "rgba(167, 139, 250, 0.8)", // Violet
                "rgba(34, 211, 238, 0.8)", // Cyan
              ],
              borderColor: "rgba(255, 255, 255, 0.8)",
              borderWidth: 2,
              borderRadius: 8,
            },
          ],
        }
      : null;

  const difficultyLevelsData = paper.difficultyLevels
    ? {
        labels: ["Easy", "Medium", "Hard"],
        datasets: [
          {
            label: "Questions",
            data: [
              paper.difficultyLevels.easy,
              paper.difficultyLevels.medium,
              paper.difficultyLevels.hard,
            ],
            backgroundColor: [
              "rgba(16, 185, 129, 0.7)", // Green
              "rgba(59, 130, 246, 0.7)", // Blue
              "rgba(239, 68, 68, 0.7)", // Red
            ],
            borderColor: "rgba(255, 255, 255, 0.8)",
            borderWidth: 2,
            borderRadius: 8,
            categoryPercentage: 0.6, // Make bars narrower
            barPercentage: 0.9,
          },
        ],
      }
    : null;

  const markingSchemeData = paper.markingScheme
    ? {
        labels: Object.keys(paper.markingScheme),
        datasets: [
          {
            label: "Marks",
            data: Object.values(paper.markingScheme),
            backgroundColor: [
              "rgba(107, 114, 128, 0.8)",
              "rgba(156, 163, 175, 0.8)",
              "rgba(209, 213, 219, 0.8)",
              "rgba(243, 244, 246, 0.8)",
              "rgba(229, 231, 235, 0.8)",
            ],
            borderColor: "rgba(255, 255, 255, 0.8)",
            borderWidth: 2,
            borderRadius: 8,
            categoryPercentage: 0.6, // Make bars narrower
            barPercentage: 0.9,
          },
        ],
      }
    : null;

  const questionTypesData = paper.questionTypes
    ? {
        labels: Object.keys(paper.questionTypes),
        datasets: [
          {
            data: Object.values(paper.questionTypes),
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
            ],
            borderColor: "rgba(255, 255, 255, 0.8)",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      }
    : null;

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
          padding: 16,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-16"
    >
      <GlassCard accentColor={accentColor}>
        <h2 className="text-3xl font-bold mb-3 text-gray-800 border-b border-gray-200/50 pb-3">
          {paper.PaperTitle + ` `}
        </h2>
        <p className="mb-8 text-gray-600 leading-relaxed">{paper.summary}</p>

        {paper.recurringTopics && Array.isArray(paper.recurringTopics) && (
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-gray-800">
              Recurring Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {paper.recurringTopics.map((topic: string, idx: number) => (
                <Tag key={idx} text={topic} color={accentColor} />
              ))}
            </div>
          </div>
        )}

        {paper.predictedQuestions && (
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800">
                Predicted Questions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paper.predictedQuestions.topics && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 text-indigo-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Topics
                  </h4>
                  <ul className="space-y-2">
                    {paper.predictedQuestions.topics.map(
                      (topic: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mt-2 mr-2"></span>
                          <span className="text-gray-700">{topic}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {paper.predictedQuestions.questionTypes && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 text-emerald-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Question Types
                  </h4>
                  <ul className="space-y-2">
                    {paper.predictedQuestions.questionTypes.map(
                      (qType: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-2"></span>
                          <span className="text-gray-700">{qType}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>

            {paper.predictedQuestions.potentialRepetitions && (
              <div className="mt-6 bg-amber-50/70 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-amber-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Potential Repetitions
                </h4>
                <ul className="space-y-2">
                  {paper.predictedQuestions.potentialRepetitions.map(
                    (item: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-2"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {paper.mustStudyQuestions && (
              <div className="mt-6 bg-zinc-100/70 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-amber-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Must Study Questions
                </h4>
                <ul className="space-y-2">
                  {paper.mustStudyQuestions.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-2"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {paper.trends && (
          <div className="mb-8 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100/50 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800">Trends</h3>
            </div>
            <p className="text-gray-700 leading-relaxed pl-14">
              {paper.trends}
            </p>
          </div>
        )}

        {paper.timeManagement && (
          <div className="mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-medium mb-4 text-gray-800">
              Time Management
            </h3>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-600">Overall Duration</p>
                <p className="text-xl font-semibold text-gray-800">
                  {paper.timeManagement.overallExamDuration}
                </p>
              </div>
            </div>

            {paper.timeManagement.suggestedTimePerSection && (
              <div className="mt-4 pl-16">
                <p className="font-medium text-gray-600 mb-2">
                  Suggested Time per Section
                </p>
                <div className="space-y-2">
                  {Object.entries(
                    paper.timeManagement.suggestedTimePerSection
                  ).map(([section, time], idx) => (
                    <div
                      key={idx}
                      className="flex justify-between border-b border-gray-100 pb-2"
                    >
                      <span className="font-medium text-gray-700">
                        {section}
                      </span>
                      <span className="text-gray-900">{time as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
          {topicDistributionData && (
            <ChartContainer title="Topic Distribution">
              <Doughnut data={topicDistributionData} options={chartOptions} />
            </ChartContainer>
          )}
          {difficultyLevelsData && (
            <ChartContainer title="Difficulty Levels( % )">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Bar
                  data={difficultyLevelsData}
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          display: false,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </motion.div>
            </ChartContainer>
          )}
          {markingSchemeData && (
            <ChartContainer title="Marking Scheme">
              <Bar
                data={markingSchemeData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </ChartContainer>
          )}
          {questionTypesData && (
            <ChartContainer title="Question Types">
              <Pie data={questionTypesData} options={chartOptions} />
            </ChartContainer>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn } = useAuth();
  const [loadingText, setLoadingText] = useState("Extracting the data");

  async function fetchAnalysis() {
    try {
      const response = await fetch("/api/analyze-ai");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch analysis");
      }
      const data = await response.json();
      setAnalysisData(data);

      // Poll again if processing
      if (data.isProcessing) {
        setTimeout(fetchAnalysis, 5000);
      }
    } catch (err: any) {
      console.error("Error fetching analysis:", err);
      setError(err.message || "An error occurred while fetching your analysis");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchAnalysis();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
      setError("You must be logged in to view analysis results.");
    }
  }, [isLoaded, isSignedIn]);

  // Reset one-time usage for unsubscribed users
  useEffect(() => {
    if (analysisData && !analysisData.isSubscribed) {
      fetch("/api/reset-one-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: analysisData.email }),
      }).catch((err) =>
        console.error("Failed to reset one-time payment status:", err)
      );
    }
  }, [analysisData]);

  useEffect(() => {
    // Toggle between the two loading messages every 2.5 seconds
    const interval = setInterval(() => {
      setLoadingText((prev) =>
        prev === "Extracting the data"
          ? "Analyzing the data"
          : "Extracting the data"
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Sharingan Loader */}
        <div className="sharingon">
          <div className="ring">
            <div className="to"></div>
            <div className="to"></div>
            <div className="to"></div>
            <div className="circle"></div>
          </div>
        </div>

        <p className="mt-6 text-lg text-gray-700 font-medium">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-md bg-white/80 border border-red-200/50 rounded-xl p-8 max-w-xl w-full shadow-lg bg-gradient-to-br from-red-50/50 to-red-100/30"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-red-700 text-2xl font-semibold">Error</h2>
          </div>
          <p className="text-red-600 ml-14">{error}</p>
        </motion.div>
      </div>
    );
  }

  // Parse analysis JSON if needed
  let parsedAnalysis = analysisData?.analysis;
  if (parsedAnalysis?.rawText && typeof parsedAnalysis.rawText === "string") {
    const extracted = extractJSON(parsedAnalysis.rawText);
    if (extracted) {
      parsedAnalysis = extracted;
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-green-600">
            Analysis Results
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto">
            Comprehensive insights and visualization of your exam data
          </p>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto">
        {!parsedAnalysis?.papers || !Array.isArray(parsedAnalysis.papers) ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Sharingan Loader */}
            <div className="sharingon">
              <div className="ring">
                <div className="to"></div>
                <div className="to"></div>
                <div className="to"></div>
                <div className="circle"></div>
              </div>
            </div>

            <p className="mt-6 text-lg text-gray-700 font-medium">
              {loadingText}
            </p>
          </div>
        ) : (
          parsedAnalysis.papers.map((paper: any, index: number) => (
            <PaperCard key={index} paper={paper} index={index} />
          ))
        )}
      </main>

      <footer className="mt-20 text-center pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="inline-flex items-center text-sm text-gray-500 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Last updated:{" "}
            {new Date(analysisData!.updatedAt).toLocaleDateString()}
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
