import React from "react";
import Image from "next/image";

const LogoTicker: React.FC = () => {
  // Create an array for 10 items.
  const items = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    // Add vertical padding to separate this section from others.
    <div className="w-full h-auto py-8 px-8">
      <h1 className="text-4xl font-bold text-center">
        Your Exam&apos;s Greatest Hack
      </h1>
      <p className="text-center text-gray-600 mt-4 mb-16">
        Learning from Its Own History, The Shortcut to Success? There Isn&apos;t
        One—But This Comes Close
      </p>

      <div className="w-full relative overflow-hidden text-center h-[75vh] md:h-[75vh]">
        {/* Slider container */}
        <div
          className="slider absolute z-20"
          style={
            {
              "--quantity": "10",
              width: "100px",
              height: "125px",
              top: "10%",
              left: "calc(50% - 40px)",
              transformStyle: "preserve-3d",
              transform: "perspective(1000px)",
              animation: "autoRun 20s linear infinite",
            } as React.CSSProperties
          }
        >
          {items.map((position) => (
            <div
              key={`${position}`}
              className="item absolute inset-0"
              style={{ "--position": position } as React.CSSProperties}
            >
              <Image
                src={`/images/${position}.webp`}
                alt={`Image ${position}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Content container with the model image */}
        <div className="content absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] pb-[100px] flex flex-wrap justify-between items-center z-10">
          <div
            className="model absolute bottom-0 left-0 w-full bg-no-repeat bg-top"
            style={{
              backgroundImage: "url('/images/model.webp')",
              height: "75vh",
              zIndex: 1,
            }}
          ></div>
        </div>

        {/* CSS for 3D animation and responsive adjustments */}
        <style jsx>{`
          @keyframes autoRun {
            from {
              transform: perspective(1000px) rotateX(-16deg) rotateY(0deg);
            }
            to {
              transform: perspective(1000px) rotateX(-16deg) rotateY(360deg);
            }
          }
          .item {
            transform: rotateY(
                calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)
              )
              translateZ(300px);
          }
          @media screen and (max-width: 1023px) {
            .slider {
              width: 160px !important;
              height: 200px !important;
              left: calc(50% - 80px) !important;
            }
          }
          @media screen and (max-width: 767px) {
            .slider {
              width: 70px !important;
              height: 105px !important;
              left: calc(50% - 30px) !important;
              top: 15% !important;
            }
            .item {
              transform: rotateY(
                  calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)
                )
                translateZ(180px);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LogoTicker;
