"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function KineticScroll({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Physics-based scroll progress with damping
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    mass: 0.8,
  });

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden"
      style={{ overscrollBehavior: "none" }}
    >
      {children}
    </div>
  );
}
