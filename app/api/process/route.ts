// import { NextRequest, NextResponse } from "next/server";
// import { IncomingForm } from "formidable";
// import { PassThrough } from "stream";
// import os from "os";
// import type { IncomingMessage } from "http";
// import { LLMWhispererClientV2 } from "llmwhisperer-client";
// import { getAuth } from "@clerk/nextjs/server";
// import axios from "axios";
// import { createClient } from "@supabase/supabase-js";

// // Initialize Supabase client with service role key
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export const config = { api: { bodyParser: false } };

// // Helper function to create a fake request for formidable
// function createFakeRequest(buffer: Buffer, req: NextRequest): IncomingMessage {
//   const stream = new PassThrough();
//   stream.end(buffer);
//   const fakeReq = stream as unknown as IncomingMessage;
//   fakeReq.headers = {
//     "content-length": buffer.length.toString(),
//     "content-type": req.headers.get("content-type") || "",
//   };
//   return fakeReq;
// }

// // Helper function to parse form data
// const parseForm = (req: NextRequest) =>
//   new Promise<{ fields: any; files: any }>(async (resolve, reject) => {
//     const arrayBuffer = await req.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const fakeReq = createFakeRequest(buffer, req);
//     const form = new IncomingForm({
//       uploadDir: os.tmpdir(),
//       keepExtensions: true,
//     });
//     form.parse(fakeReq, (err, fields, files) => {
//       if (err) reject(err);
//       else resolve({ fields, files });
//     });
//   });

// export async function POST(req: NextRequest) {
//   // Authenticate user
//   const { userId } = getAuth(req);
//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // Parse uploaded files
//   const { files: parsedFiles } = await parseForm(req);
//   if (!parsedFiles?.files) {
//     return NextResponse.json({ error: "No files received" }, { status: 400 });
//   }
//   const files = Array.isArray(parsedFiles.files)
//     ? parsedFiles.files
//     : [parsedFiles.files];

//   // Fetch user data from the users table
//   const { data: userData } = await supabase
//     .from("users")
//     .select("email, subscription_status")
//     .eq("clerk_user_id", userId)
//     .single();
//   if (!userData?.email) {
//     return NextResponse.json({ error: "User not found" }, { status: 400 });
//   }
//   const isSubscribed = userData.subscription_status || false;

//   // Store or update initial analysis record
//   const { data: analysisData } = await supabase
//     .from("analyses")
//     .upsert({
//       email: userData.email,
//       analysis_text: null, // clear previous analysis result
//       updated_at: new Date(),
//     })
//     .select("email")
//     .single();

//   // Process files in the background
//   setTimeout(async () => {
//     try {
//       let combinedText = "";
//       // Extract text from files using LLMWhisperer
//       for (const fileObj of files) {
//         const whisperResult = await new LLMWhispererClientV2().whisper({
//           filePath: fileObj.filepath,
//           waitForCompletion: true,
//           waitTimeout: 120,
//         });
//         combinedText += `\n---\n${whisperResult.extraction?.result_text || ""}`;
//       }

//       // Define system and user messages for the AI prompt
//       const systemMessage = {
//         role: "system",
//         content: `
//       Analyze the uploaded exam paper file(s) and produce a top-notch, insightful JSON report. Users can upload 1 to 5 files. If multiple papers are provided, generate one combined analysis that aggregates key details; if only one paper is provided, analyze it in depth.

//       Include the following fields with consistent names:
//       1. **combinedPaperTitles**: An array of paper titles or identifiers.
//       2. **summary**: A concise yet detailed overview highlighting the overall content, structure, and key insights.
//       3. **topicDistribution**:
//          - If a syllabus is available or can be inferred, provide a breakdown of topics/chapters with the number of questions per topic.
//          - If not, indicate that syllabus data is missing.
//       4. **difficultyLevels**: Percentages of questions categorized as easy, medium, and hard.
//       5. **questionTypes**: Distribution of question formats (e.g., MCQs, short answers, long answers).
//       6. **recurringTopics**: Identification of topics or question patterns that recur throughout the paper(s).
//       7. **markingScheme**: Detailed marks allocation per topic or section percentage wise, if available.
//       8. **timeManagement**:
//          - Suggested time allocation per section based on question weightage.
//          - Overall recommended exam duration.
//       9. **trends**:
//          - For multiple papers, highlight trends and shifts in question patterns over time.
//          - For a single paper, provide internal pattern insights.
//       10. **predictedQuestions**: Based on historical patterns, exam psychology, and probability, predict:
//           - Prominent topics or chapters for the next exam.
//           - Likely question types (e.g., conceptual, application-based, MCQs).
//           - Potential questions or patterns that might be repeated or rephrased.
//       11. **mustStudyQuestions**: A list of questions or topics that students must prioritize based on the analysis, derived from recurring topics, high-weightage areas, difficulty levels, and predicted patterns. Include specific question examples or focused topics where applicable.

//       **Important:** Return only valid JSON with no extra text, disclaimers, or code fences. Do not wrap the output in triple backticks.

//       Return JSON in this format:

//       {
//         "papers":
//         [{
//           "PaperTitle": ["Paper Title 1", "Paper Title 2"],
//           "summary": "Insightful summary text...",
//           "topicDistribution": {
//             "syllabusAvailable": true,
//             "topics": [
//               {"name": "Topic 1", "questionCount": 5},
//               {"name": "Topic 2", "questionCount": 3}
//             ]
//           },
//           "difficultyLevels": {
//             "easy": 30,
//             "medium": 50,
//             "hard": 20
//           },
//           "questionTypes": {
//             "MCQs": 12,
//             "shortAnswers": 10,
//             "longAnswers": 3
//           },
//           "recurringTopics": ["Topic 1", "Topic 3"],
//           "markingScheme": {
//             "Topic 1": 20%,
//             "Topic 2": 15%
//           },
//           "timeManagement": {
//             "suggestedTimePerSection": {
//               "Topic 1": "30 minutes",
//               "Topic 2": "20 minutes"
//             },
//             "overallExamDuration": "90 minutes"
//           },
//           "trends": "Trend analysis...",
//           "predictedQuestions": {
//             "topics": ["Topic 1", "Topic 4"],
//             "questionTypes": ["Conceptual", "MCQs"],
//             "potentialRepetitions": [
//               "Potential repeated question 1",
//               "Potential repeated question 2"
//             ]
//           },
//           "mustStudyQuestions": ["Must-study question 1", "Must-study question 2"]
//         }
//       ]
//       }
//         `.trim(),
//       };

//       const userMessage = {
//         role: "user",
//         content: `Here is the combined text from the uploaded exam papers:\n\n${combinedText}`,
//       };

//       // Perform AI analysis using system and user roles
//       const aiResponse = await axios.post(
//         "https://openrouter.ai/api/v1/chat/completions",
//         {
//           model: "google/gemini-2.0-flash-lite-preview-02-05:free",
//           messages: [systemMessage, userMessage],
//           response_format: { type: "json_object" },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//             timeout: 20000,
//           },
//         }
//       );

//       // Retrieve the response text from the AI
//       const aiText = aiResponse.data.choices[0].message.content;
//       let analysisJSON;

//       try {
//         analysisJSON = JSON.parse(aiText);
//       } catch (error) {
//         console.error("AI returned invalid JSON. Storing raw text.", error);
//         analysisJSON = { rawText: aiText };
//       }

//       // Update analysis record with JSON results (jsonb type)
//       await supabase
//         .from("analyses")
//         .update({
//           analysis_text: analysisJSON,
//           updated_at: new Date(),
//         })
//         .eq("email", userData.email);
//     } catch (error) {
//       console.error("Background processing failed:", error);
//       // Optionally update the record to indicate failure
//     }
//   }, 0);

//   // Return immediate response
//   return NextResponse.json({
//     analysisData,
//     message: "Processing started successfully",
//     isSubscribed,
//   });
// }

import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import { PassThrough } from "stream";
import os from "os";
import type { IncomingMessage } from "http";
import { LLMWhispererClientV2 } from "llmwhisperer-client";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = { api: { bodyParser: false } };

// Define interfaces for parsed form data
interface FormFields {
  [key: string]: string | string[];
}

interface ParsedFile {
  filepath: string;
  originalFilename?: string;
  mimetype?: string;
  size?: number;
  // You can extend this interface if needed
}

interface FormFiles {
  [key: string]: ParsedFile | ParsedFile[];
}

// Helper function to create a fake request for formidable
function createFakeRequest(buffer: Buffer, req: NextRequest): IncomingMessage {
  const stream = new PassThrough();
  stream.end(buffer);
  const fakeReq = stream as unknown as IncomingMessage;
  fakeReq.headers = {
    "content-length": buffer.length.toString(),
    "content-type": req.headers.get("content-type") || "",
  };
  return fakeReq;
}

// Helper function to parse form data
const parseForm = async (
  req: NextRequest
): Promise<{ fields: FormFields; files: FormFiles }> => {
  const arrayBuffer = await req.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fakeReq = createFakeRequest(buffer, req);
  const form = new IncomingForm({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });
  return new Promise((resolve, reject) => {
    form.parse(fakeReq, (err, fields, files) => {
      if (err) reject(err);
      else
        resolve({
          fields: fields as FormFields,
          files: files as FormFiles,
        });
    });
  });
};

export async function POST(req: NextRequest) {
  // Authenticate user
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse uploaded files
  const { files: parsedFiles } = await parseForm(req);
  // Adjusted destructuring based on expected structure; if your form field name is "files"
  if (!parsedFiles?.files) {
    return NextResponse.json({ error: "No files received" }, { status: 400 });
  }
  const files = Array.isArray(parsedFiles.files)
    ? parsedFiles.files
    : [parsedFiles.files];

  // Fetch user data from the users table
  const { data: userData } = await supabase
    .from("users")
    .select("email, subscription_status")
    .eq("clerk_user_id", userId)
    .single();
  if (!userData?.email) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }
  const isSubscribed = userData.subscription_status || false;

  // Store or update initial analysis record
  const { data: analysisData } = await supabase
    .from("analyses")
    .upsert({
      email: userData.email,
      analysis_text: null, // clear previous analysis result
      updated_at: new Date(),
    })
    .select("email")
    .single();

  // Process files in the background
  setTimeout(async () => {
    try {
      let combinedText = "";
      // Extract text from files using LLMWhisperer
      for (const fileObj of files) {
        const whisperResult = await new LLMWhispererClientV2().whisper({
          filePath: fileObj.filepath,
          waitForCompletion: true,
          waitTimeout: 120,
        });
        combinedText += `\n---\n${whisperResult.extraction?.result_text || ""}`;
      }

      // Define system and user messages for the AI prompt
      const systemMessage = {
        role: "system",
        content: `
      Analyze the uploaded exam paper file(s) and produce a top-notch, insightful JSON report. Users can upload 1 to 5 files. If multiple papers are provided, generate one combined analysis that aggregates key details; if only one paper is provided, analyze it in depth.
      
      Include the following fields with consistent names:
      1. **combinedPaperTitles**: An array of paper titles or identifiers.
      2. **summary**: A concise yet detailed overview highlighting the overall content, structure, and key insights.
      3. **topicDistribution**: 
         - If a syllabus is available or can be inferred, provide a breakdown of topics/chapters with the number of questions per topic.
         - If not, indicate that syllabus data is missing.
      4. **difficultyLevels**: Percentages of questions categorized as easy, medium, and hard.
      5. **questionTypes**: Distribution of question formats (e.g., MCQs, short answers, long answers).
      6. **recurringTopics**: Identification of topics or question patterns that recur throughout the paper(s).
      7. **markingScheme**: Detailed marks allocation per topic or section percentage wise, if available.
      8. **timeManagement**: 
         - Suggested time allocation per section based on question weightage.
         - Overall recommended exam duration.
      9. **trends**: 
         - For multiple papers, highlight trends and shifts in question patterns over time.
         - For a single paper, provide internal pattern insights.
      10. **predictedQuestions**: Based on historical patterns, exam psychology, and probability, predict:
          - Prominent topics or chapters for the next exam.
          - Likely question types (e.g., conceptual, application-based, MCQs).
          - Potential questions or patterns that might be repeated or rephrased.
      11. **mustStudyQuestions**: A list of questions or topics that students must prioritize based on the analysis, derived from recurring topics, high-weightage areas, difficulty levels, and predicted patterns. Include specific question examples or focused topics where applicable.
      
      **Important:** Return only valid JSON with no extra text, disclaimers, or code fences. Do not wrap the output in triple backticks.
      
      Return JSON in this format:
      
      {
        "papers": 
        [{
          "PaperTitle": ["Paper Title 1", "Paper Title 2"],
          "summary": "Insightful summary text...",
          "topicDistribution": {
            "syllabusAvailable": true,
            "topics": [
              {"name": "Topic 1", "questionCount": 5},
              {"name": "Topic 2", "questionCount": 3}
            ]
          },
          "difficultyLevels": {
            "easy": 30,
            "medium": 50,
            "hard": 20
          },
          "questionTypes": {
            "MCQs": 12,
            "shortAnswers": 10,
            "longAnswers": 3
          },
          "recurringTopics": ["Topic 1", "Topic 3"],
          "markingScheme": {
            "Topic 1": 20%,
            "Topic 2": 15%
          },
          "timeManagement": {
            "suggestedTimePerSection": {
              "Topic 1": "30 minutes",
              "Topic 2": "20 minutes"
            },
            "overallExamDuration": "90 minutes"
          },
          "trends": "Trend analysis...",
          "predictedQuestions": {
            "topics": ["Topic 1", "Topic 4"],
            "questionTypes": ["Conceptual", "MCQs"],
            "potentialRepetitions": [
              "Potential repeated question 1",
              "Potential repeated question 2"
            ]
          },
          "mustStudyQuestions": ["Must-study question 1", "Must-study question 2"]
        }]
      }
        `.trim(),
      };

      const userMessage = {
        role: "user",
        content: `Here is the combined text from the uploaded exam papers:\n\n${combinedText}`,
      };

      // Perform AI analysis using system and user roles
      const aiResponse = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "google/gemini-2.0-flash-lite-preview-02-05:free",
          messages: [systemMessage, userMessage],
          response_format: { type: "json_object" },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            timeout: 20000,
          },
        }
      );

      // Retrieve the response text from the AI
      const aiText = aiResponse.data.choices[0].message.content;
      let analysisJSON;

      try {
        analysisJSON = JSON.parse(aiText);
      } catch (error) {
        console.error("AI returned invalid JSON. Storing raw text.", error);
        analysisJSON = { rawText: aiText };
      }

      // Update analysis record with JSON results (jsonb type)
      await supabase
        .from("analyses")
        .update({
          analysis_text: analysisJSON,
          updated_at: new Date(),
        })
        .eq("email", userData.email);
    } catch (error) {
      console.error("Background processing failed:", error);
      // Optionally update the record to indicate failure
    }
  }, 0);

  // Return immediate response
  return NextResponse.json({
    analysisData,
    message: "Processing started successfully",
    isSubscribed,
  });
}
