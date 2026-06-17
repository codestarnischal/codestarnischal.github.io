"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { ReactNode, MouseEvent } from "react";
import { useSensory } from "./SensoryProvider";

interface KineticLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export default function KineticLink({ href, children, className = "", external }: KineticLinkProps) {
  const { triggerInteraction } = useSensory();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 20 });

  const glowOpacity = useMotionValue(0);
  const glowSpring = useSpring(glowOpacity, { stiffness: 100, damping: 25 });

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.15);
    glowOpacity.set(1);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    glowOpacity.set(0);
  };

  const onMouseEnter = () => {
    triggerInteraction();
  };

  const inner = (
    <motion.span
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{ x: springX, y: springY, display: "inline-block", position: "relative" }}
      className={`group relative ${className}`}
    >
      {children}
      {/* Ambient gold underline that grows from center */}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-px origin-center"
        style={{
          scaleX: glowSpring,
          background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
        }}
      />
    </motion.span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      {inner}
    </Link>
  );
}
