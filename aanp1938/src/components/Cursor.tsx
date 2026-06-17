"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const lastPos = useRef({ x: -100, y: -100 });
  // Initialized lazily inside the move handler — avoid impure Date.now() in render.
  const lastTime = useRef(0);

  const springConfig = { damping: 28, stiffness: 200, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const now = Date.now();
      // First sample: seed position/time without computing a spurious velocity.
      if (lastTime.current === 0) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        lastTime.current = now;
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        return;
      }
      const dt = Math.max(now - lastTime.current, 1);
      const vx = (e.clientX - lastPos.current.x) / dt * 16;
      const vy = (e.clientY - lastPos.current.y) / dt * 16;
      setVelocity({ x: vx, y: vy });
      lastPos.current = { x: e.clientX, y: e.clientY };
      lastTime.current = now;
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const enterInteractive = () => setIsHovering(true);
    const leaveInteractive = () => setIsHovering(false);

    document.addEventListener("mousemove", move);

    const interactives = document.querySelectorAll("a, button, [data-interactive]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", enterInteractive);
      el.addEventListener("mouseleave", leaveInteractive);
    });

    const observer = new MutationObserver(() => {
      const updated = document.querySelectorAll("a, button, [data-interactive]");
      updated.forEach((el) => {
        el.addEventListener("mouseenter", enterInteractive);
        el.addEventListener("mouseleave", leaveInteractive);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  const skewX = Math.max(-20, Math.min(20, velocity.x * 0.5));

  return (
    <>
      {/* Main fluid cursor blob */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 48 : 12,
            height: isHovering ? 48 : 12,
            skewX: skewX,
            scaleX: isHovering ? 1 : 1 + Math.abs(velocity.x) * 0.03,
            scaleY: isHovering ? 1 : Math.max(0.6, 1 - Math.abs(velocity.y) * 0.015),
            backgroundColor: isHovering ? "#D4AF37" : "#F8F5F0",
          }}
          transition={{ type: "spring", damping: 22, stiffness: 300, mass: 0.3 }}
          style={{
            borderRadius: isHovering ? "50%" : "40%",
          }}
        />
      </motion.div>

      {/* Trailing glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: isHovering
            ? "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(248,245,240,0.05) 0%, transparent 70%)",
          transition: "background 0.4s ease",
        }}
      />
    </>
  );
}
