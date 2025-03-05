// export function GridPattern() {
//   const columns = 41;
//   const rows = 11;
//   return (
//     <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px">
//       {Array.from({ length: rows }).map((_, row) =>
//         Array.from({ length: columns }).map((_, col) => {
//           const index = row * columns + col;
//           return (
//             <div
//               key={`${col}-${row}`}
//               className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
//                 index % 2 === 0
//                   ? "bg-gray-50 dark:bg-neutral-950"
//                   : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
//               }`}
//             />
//           );
//         })
//       )}
//     </div>
//   );
// }

// // app/components/FileUpload.tsx
// import { cn } from "@/lib/utils";
// import React, { useRef, useState } from "react";
// import { easeIn, motion } from "framer-motion";
// import { IconUpload, IconX } from "@tabler/icons-react";
// import { useDropzone } from "react-dropzone";
// import { useUser, useClerk, useSession } from "@clerk/nextjs";
// import axios from "axios";
// import PaymentOptions from "../PaymentOptions";
// import { createClient } from "@supabase/supabase-js";

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// const mainVariant = {
//   initial: { x: 0, y: 0 },
//   animate: { x: 0, y: -10, ease: easeIn, opacity: 0.9 },
// };

// const secondaryVariant = {
//   initial: { opacity: 0 },
//   animate: { opacity: 1 },
// };

// // Retry function with exponential backoff for client-side requests
// async function retryWithBackoff<T>(
//   fn: () => Promise<T>,
//   maxRetries = 3,
//   initialDelay = 1000,
//   maxDelay = 10000
// ): Promise<T> {
//   let retries = 0;
//   let delay = initialDelay;

//   while (true) {
//     try {
//       return await fn();
//     } catch (error: any) {
//       retries++;
//       // If we've reached max retries or it's not a connection error, throw
//       if (
//         retries >= maxRetries ||
//         (error.code !== "ECONNRESET" &&
//           error.code !== "ETIMEDOUT" &&
//           error.code !== "ECONNABORTED" &&
//           error.message?.indexOf("network") === -1)
//       ) {
//         console.error(`Failed after ${retries} retries:`, error);
//         throw error;
//       }

//       // Calculate backoff delay with jitter
//       const jitter = Math.random() * 0.3 + 0.85; // Random value between 0.85 and 1.15
//       delay = Math.min(delay * 2 * jitter, maxDelay);

//       console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
//       await new Promise((resolve) => setTimeout(resolve, delay));
//     }
//   }
// }

// export const FileUpload = ({
//   onChange,
// }: {
//   onChange?: (files: File[]) => void;
// }) => {
//   const [files, setFiles] = useState<File[]>([]);
//   const [showPaymentOptions, setShowPaymentOptions] = useState(false);
//   const [analysisId, setAnalysisId] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { user, isLoaded } = useUser();
//   const { openSignIn } = useClerk();
//   const maxFiles = 5;
//   const { session } = useSession();

//   const handleFileChange = (newFiles: File[]) => {
//     const allowedFiles = [...files, ...newFiles].slice(0, maxFiles);
//     setFiles(allowedFiles);
//     onChange && onChange(allowedFiles);
//   };

//   const handleRemoveFile = (indexToRemove: number) => {
//     const updatedFiles = files.filter((_, idx) => idx !== indexToRemove);
//     setFiles(updatedFiles);
//     onChange && onChange(updatedFiles);
//   };

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   const analyzeFiles = async () => {
//     if (!isLoaded || files.length === 0) return;

//     // If user is not logged in, open sign-in modal
//     if (!user) {
//       openSignIn();
//       return;
//     }

//     if (!session) {
//       console.error("Session is not available");
//       return;
//     }

//     setIsProcessing(true);
//     setUploadError(null);

//     try {
//       const token = await session.getToken();
//       console.log("Token from session:", token);

//       // Check subscription status with retry
//       const { data } = await retryWithBackoff(() =>
//         axios.post(
//           "/api/check-subscription",
//           {},
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             timeout: 10000, // 10 seconds timeout
//           }
//         )
//       );

//       const isPaid = data.isPaid;

//       // Create an axios instance with increased timeout
//       const axiosInstance = axios.create({
//         timeout: 30000, // 30 seconds
//       });

//       // Process files in the background with retry
//       const formData = new FormData();
//       files.forEach((file) => formData.append("files", file));

//       const processResponse = await retryWithBackoff(
//         () =>
//           axiosInstance.post("/api/process", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//           }),
//         3,
//         2000
//       );

//       const { analysisData } = processResponse.data;
//       setAnalysisId(analysisData.email); // Email as unique key

//       // Redirect immediately after starting background processing
//       if (isPaid) {
//         console.log("Redirecting to analysis...");
//         window.location.href = "/analysis";
//       } else {
//         console.log("Showing payment options");
//         setShowPaymentOptions(true);
//       }
//     } catch (error: any) {
//       console.error("Error processing files:", error);
//       setUploadError(
//         error?.message || "Error processing files. Please try again."
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const { getRootProps, isDragActive } = useDropzone({
//     multiple: true,
//     maxFiles,
//     noClick: true,
//     onDrop: handleFileChange,
//     onDropRejected: (error) => console.log("File drop rejected:", error),
//   });

//   return (
//     <div className="w-full" {...getRootProps()}>
//       <motion.div
//         onClick={handleClick}
//         whileHover="animate"
//         className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
//       >
//         <input
//           ref={fileInputRef}
//           id="file-upload-handle"
//           type="file"
//           onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
//           className="hidden"
//           multiple
//         />

//         <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
//           <GridPattern />
//         </div>

//         <div className="flex flex-col items-center justify-center">
//           <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
//             Upload file
//           </p>
//           <p className="relative z-20 font-sans px-8 font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2 text-center">
//             Drag and drop your files here or click to upload (up to {maxFiles})
//           </p>
//           <div className="relative w-full mt-10 max-w-xl mx-auto">
//             {files.length > 0 &&
//               files.map((file, idx) => (
//                 <motion.div
//                   key={"file" + idx}
//                   layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
//                   className={cn(
//                     "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-4 mt-4 w-full rounded-md shadow-sm"
//                   )}
//                 >
//                   <div className="flex justify-between w-full items-center">
//                     <motion.p
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       layout
//                       className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
//                     >
//                       {file.name}
//                     </motion.p>
//                     <div className="flex items-center gap-2">
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         layout
//                         className="rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
//                       >
//                         {(file.size / (1024 * 1024)).toFixed(2)} MB
//                       </motion.p>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRemoveFile(idx);
//                         }}
//                         className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
//                         title="Remove file"
//                         disabled={isProcessing}
//                       >
//                         <IconX className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}

//             {!files.length && (
//               <motion.div
//                 layoutId="file-upload"
//                 variants={mainVariant}
//                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                 className={cn(
//                   "relative group-hover/file:shadow-2xl z-15 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
//                 )}
//               >
//                 {isDragActive ? (
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="text-neutral-600 flex flex-col items-center"
//                   >
//                     Drop it
//                     <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
//                   </motion.p>
//                 ) : (
//                   <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
//                 )}
//               </motion.div>
//             )}

//             {!files.length && (
//               <motion.div
//                 variants={secondaryVariant}
//                 className="absolute opacity-10 border border-green-300 inset-0 z-10 bg-transparent flex items-center justify-center h-32 w-full max-w-[8rem] mx-auto rounded-md"
//               ></motion.div>
//             )}

//             {files.length > 0 && (
//               <>
//                 {uploadError && (
//                   <div className="text-red-500 text-center mt-4">
//                     {uploadError}
//                   </div>
//                 )}

//                 <motion.button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     analyzeFiles();
//                   }}
//                   whileHover={{ scale: isProcessing ? 1 : 1.05 }}
//                   disabled={isProcessing}
//                   className={`w-1/2 mx-auto flex items-center justify-center rounded-3xl border
//                     ${
//                       isProcessing
//                         ? "animate-shimmer bg-[linear-gradient(110deg,#f8f9fa,45%,#61f380,55%,#f8f9fa)] bg-[length:200%_100%] text-gray-900 hover:scale-105 cursor-not-allowed"
//                         : "animate-shimmer bg-[linear-gradient(110deg,#f8f9fa,45%,#61f380,55%,#f8f9fa)] bg-[length:200%_100%] text-gray-900 hover:scale-105"
//                     }
//                     mt-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green`}
//                 >
//                   {isProcessing ? "Analyzing..." : "Analyze"}
//                 </motion.button>
//               </>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       {/* Show payment options for non-subscribed users */}
//       {showPaymentOptions && analysisId && (
//         <PaymentOptions
//           email={user?.primaryEmailAddress?.emailAddress ?? null}
//           analysisId={analysisId}
//           onClose={() => setShowPaymentOptions(false)}
//         />
//       )}
//     </div>
//   );
// };

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

// app/components/FileUpload.tsx
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { easeIn, motion } from "framer-motion";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { useUser, useClerk, useSession } from "@clerk/nextjs";
import axios from "axios";
import PaymentOptions from "../PaymentOptions";
// Removed unused supabase client initialization
// import { createClient } from "@supabase/supabase-js";

// Animation variants
const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 0, y: -10, ease: easeIn, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

// Retry function with exponential backoff (using unknown instead of any)
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 10000
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      retries++;
      if (
        retries >= maxRetries ||
        (err.code !== "ECONNRESET" &&
          err.code !== "ETIMEDOUT" &&
          err.code !== "ECONNABORTED" &&
          (typeof err.message === "string"
            ? err.message.indexOf("network") === -1
            : true))
      ) {
        console.error(`Failed after ${retries} retries:`, error);
        throw error;
      }

      const jitter = Math.random() * 0.3 + 0.85; // Random value between 0.85 and 1.15
      delay = Math.min(delay * 2 * jitter, maxDelay);
      console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const maxFiles = 5;
  const { session } = useSession();

  const handleFileChange = (newFiles: File[]) => {
    const allowedFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(allowedFiles);
    onChange && onChange(allowedFiles);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updatedFiles);
    onChange && onChange(updatedFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeFiles = async () => {
    if (!isLoaded || files.length === 0) return;

    if (!user) {
      openSignIn();
      return;
    }

    if (!session) {
      console.error("Session is not available");
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    try {
      const token = await session.getToken();
      console.log("Token from session:", token);

      const { data } = await retryWithBackoff(() =>
        axios.post(
          "/api/check-subscription",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        )
      );

      const isPaid = data.isPaid;

      const axiosInstance = axios.create({
        timeout: 30000,
      });

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const processResponse = await retryWithBackoff(
        () =>
          axiosInstance.post("/api/process", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        3,
        2000
      );

      const { analysisData } = processResponse.data;
      setAnalysisId(analysisData.email); // Email as unique key

      if (isPaid) {
        console.log("Redirecting to analysis...");
        window.location.href = "/analysis";
      } else {
        console.log("Showing payment options");
        setShowPaymentOptions(true);
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("Error processing files:", error);
      setUploadError(
        err?.message || "Error processing files. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    maxFiles,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => console.log("File drop rejected:", error),
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          multiple
        />

        <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload file
          </p>
          <p className="relative z-20 font-sans px-8 font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2 text-center">
            Drag and drop your files here or click to upload (up to {maxFiles})
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-4 mt-4 w-full rounded-md shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <div className="flex items-center gap-2">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
                        title="Remove file"
                        disabled={isProcessing}
                      >
                        <IconX className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-15 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-10 border border-green-300 inset-0 z-10 bg-transparent flex items-center justify-center h-32 w-full max-w-[8rem] mx-auto rounded-md"
              />
            )}

            {files.length > 0 && (
              <>
                {uploadError && (
                  <div className="text-red-500 text-center mt-4">
                    {uploadError}
                  </div>
                )}

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    analyzeFiles();
                  }}
                  whileHover={{ scale: isProcessing ? 1 : 1.05 }}
                  disabled={isProcessing}
                  className={`w-1/2 mx-auto flex items-center justify-center rounded-3xl border 
                    ${
                      isProcessing
                        ? "animate-shimmer bg-[linear-gradient(110deg,#f8f9fa,45%,#61f380,55%,#f8f9fa)] bg-[length:200%_100%] text-gray-900 hover:scale-105 cursor-not-allowed"
                        : "animate-shimmer bg-[linear-gradient(110deg,#f8f9fa,45%,#61f380,55%,#f8f9fa)] bg-[length:200%_100%] text-gray-900 hover:scale-105"
                    } 
                    mt-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green`}
                >
                  {isProcessing ? "Analyzing..." : "Analyze"}
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {showPaymentOptions && analysisId && (
        <PaymentOptions
          email={user?.primaryEmailAddress?.emailAddress ?? null}
          analysisId={analysisId}
          onClose={() => setShowPaymentOptions(false)}
        />
      )}
    </div>
  );
};
