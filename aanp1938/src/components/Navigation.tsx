"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import KineticLink from "./KineticLink";

const navItems = [
  { label: "Heritage", href: "/heritage" },
  { label: "Atelier", href: "/atelier" },
  { label: "Provenance", href: "/provenance" },
  { label: "Acquire", href: "/acquire" },
];

export default function Navigation() {
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 120], [0, 0.85]);
  const blur = useTransform(scrollY, [0, 120], [0, 20]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-12 py-8 flex items-center justify-between"
      style={{
        backdropFilter: blur.get() > 1 ? `blur(${blur.get()}px)` : "none",
      }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: backgroundOpacity,
          background: "linear-gradient(180deg, rgba(11,15,25,0.95) 0%, rgba(11,15,25,0) 100%)",
        }}
      />

      {/* Wordmark */}
      <KineticLink href="/" className="relative z-10">
        <span
          className="text-xl tracking-[0.35em] uppercase"
          style={{ color: "#D4AF37", fontWeight: 300, letterSpacing: "0.35em" }}
        >
          Aanp
        </span>
        <span
          className="text-xl tracking-widest ml-2"
          style={{ color: "rgba(248,245,240,0.5)", fontWeight: 300, fontSize: "0.75rem" }}
        >
          1938
        </span>
      </KineticLink>

      {/* Nav links */}
      <nav className="relative z-10 flex items-center gap-10">
        {navItems.map((item) => (
          <KineticLink
            key={item.href}
            href={item.href}
            className="text-sm tracking-[0.25em] uppercase"
          >
            <span style={{ color: "rgba(248,245,240,0.65)", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.25em" }}>
              {item.label}
            </span>
          </KineticLink>
        ))}
      </nav>
    </motion.header>
  );
}
