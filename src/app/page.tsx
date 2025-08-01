"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ShrimpProps {
  size: number;
  left: number;
  delay: number;
  duration: number;
  animationType: "rotate" | "flip" | "static";
}

function Shrimp({ size, left, delay, duration, animationType }: ShrimpProps) {
  // Start way above the viewport based on size
  const startY = -(size + 200);
  
  return (
    <div
      className="absolute"
      style={{
        left: `${left}%`,
        top: `${startY}px`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `${
          animationType === "rotate"
            ? "fallRotate"
            : animationType === "flip"
            ? "fallFlip"
            : "fall"
        } ${duration}s ${delay}s linear infinite both`,
      }}
    >
      <Image
        src="/IO5M.gif"
        alt="Shrimp playing saxophone"
        width={size}
        height={size}
        className="opacity-80"
        unoptimized
      />
    </div>
  );
}

export default function Home() {
  const [tagline] = useState(
    "the world's first future trillion dollar creative brand."
  );
  const [shrimps, setShrimps] = useState<
    Array<{
      id: number;
      left: number;
      delay: number;
      duration: number;
      size: number;
      animationType: "rotate" | "flip" | "static";
    }>
  >([]);

  useEffect(() => {
    // Generate shrimps with even distribution across the screen
    const newShrimps = Array.from({ length: 60 }, (_, i) => {
      const animationType = ["rotate", "flip", "static"][
        Math.floor(Math.random() * 3)
      ] as "rotate" | "flip" | "static";
      
      // Distribute shrimps more evenly by dividing screen into sections
      const section = i % 10; // 10 sections across the screen
      const sectionWidth = 100 / 10; // Each section is 10% wide
      const left = (section * sectionWidth) + (Math.random() * sectionWidth);
      
      return {
        id: i,
        left: left,
        delay: Math.random() * 10, // 0-10 seconds delay
        duration: 8 + Math.random() * 12, // 8-20 seconds duration
        size: 40 + Math.random() * 80, // 40-120px
        animationType,
      };
    });
    setShrimps(newShrimps);
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Raining shrimps */}
      {shrimps.map((shrimp) => (
        <Shrimp
          key={shrimp.id}
          size={shrimp.size}
          left={shrimp.left}
          delay={shrimp.delay}
          duration={shrimp.duration}
          animationType={shrimp.animationType}
        />
      ))}

      {/* Center message with box */}
      <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
        <div className="bg-black/60 backdrop-blur-md border border-white/20 p-8 md:p-12 lg:p-16 rounded-2xl shadow-2xl max-w-5xl">
          <h1 className="text-white/90 text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light tracking-widest jazz-text">
              <span
                className="font-bold text-white tracking-tight"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                self-driving jazz
              </span>{" "}
              <span className="italic">is {tagline}</span>
              <br />
              <span className="italic">🚗🎷</span>
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
}