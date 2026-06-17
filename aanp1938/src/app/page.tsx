"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import KineticLink from "@/components/KineticLink";

const GOLD = "#D4AF37";
const SILK = "#F8F5F0";
const SILK_DIM = "rgba(248,245,240,0.45)";

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-8"
    >
      <motion.div
        style={{ y: springY, opacity }}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.45em" }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-xs uppercase mb-16"
          style={{ color: GOLD, fontWeight: 300 }}
        >
          Kathmandu · Est. 1938 · High Himalaya
        </motion.p>

        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="leading-none"
            style={{
              fontSize: "clamp(4rem, 12vw, 10rem)",
              fontWeight: 300,
              color: SILK,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
            }}
          >
            Aanp
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-20">
          <motion.p
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
            className="text-sm tracking-[0.6em] uppercase"
            style={{ color: SILK_DIM, fontWeight: 300 }}
          >
            A Nepali Heritage Atelier
          </motion.p>
        </div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          className="mx-auto mb-20 origin-center"
          style={{
            width: 160,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 1.8 }}
          className="flex items-center justify-center gap-16"
        >
          <KineticLink href="/atelier">
            <span
              className="text-xs tracking-[0.4em] uppercase"
              style={{ color: SILK_DIM, fontWeight: 300 }}
            >
              Enter the Atelier
            </span>
          </KineticLink>

          <span style={{ color: "rgba(212,175,55,0.25)" }}>·</span>

          <KineticLink href="/heritage">
            <span
              className="text-xs tracking-[0.4em] uppercase"
              style={{ color: SILK_DIM, fontWeight: 300 }}
            >
              Our Provenance
            </span>
          </KineticLink>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 32, background: `linear-gradient(180deg, ${GOLD}, transparent)` }}
        />
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: GOLD, opacity: 0.5, fontSize: "0.6rem" }}>
          Descend
        </span>
      </motion.div>
    </section>
  );
}

function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.35, 0.75, 0.95], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.1, 0.4], [60, 0]);
  const springY = useSpring(y, { stiffness: 50, damping: 22 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-8 py-40"
    >
      <motion.div
        style={{ opacity, y: springY }}
        className="max-w-2xl mx-auto text-center"
      >
        <p
          className="leading-[2.2] mb-16"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "rgba(248,245,240,0.7)",
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          Before the roads arrived, before the maps were drawn —
          our weavers read the altitude in their fingers.
          Each thread pulled from the mist of the Mustang plateau,
          each dye drawn from roots that grow nowhere else on earth.
        </p>

        <div
          className="w-px h-20 mx-auto mb-16"
          style={{ background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)` }}
        />

        <p
          className="text-sm tracking-[0.25em] uppercase"
          style={{ color: GOLD, fontWeight: 300 }}
        >
          Eighty-six years of mountain craft
        </p>
      </motion.div>
    </section>
  );
}

function CollectionSection() {
  const items = [
    {
      name: "Kora Weave",
      origin: "Upper Mustang, 3,800m",
      year: "Collection I",
      desc: "Handwoven pashmina, natural mineral dyes, 240 hours of craft.",
    },
    {
      name: "Annapurna Drape",
      origin: "Manang Valley, 3,500m",
      year: "Collection II",
      desc: "Raw silk from Palpa, hand-embroidered with Newari motifs.",
    },
    {
      name: "Boudha Silk",
      origin: "Kathmandu Valley, 1,400m",
      year: "Collection III",
      desc: "Eri silk, tumeric and indigo dyed. One piece per season.",
    },
  ];

  return (
    <section className="relative min-h-screen px-8 py-40">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: GOLD, fontWeight: 300 }}>
            The Atelier
          </p>
          <h2
            className="leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 300, color: SILK, fontStyle: "italic" }}
          >
            Pieces born<br />from altitude
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
              viewport={{ once: true, margin: "-80px" }}
              data-interactive="true"
              className="group relative p-10 cursor-none"
              style={{
                background: "rgba(47,54,64,0.15)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(212,175,55,0.08)",
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 70%)",
                }}
              />

              <p className="text-xs tracking-[0.35em] uppercase mb-6" style={{ color: GOLD, opacity: 0.6, fontWeight: 300, fontSize: "0.6rem" }}>
                {item.year}
              </p>
              <h3
                className="mb-3"
                style={{ fontSize: "1.4rem", fontWeight: 300, color: SILK, fontStyle: "italic" }}
              >
                {item.name}
              </h3>
              <p className="text-xs mb-6" style={{ color: "rgba(212,175,55,0.7)", letterSpacing: "0.1em" }}>
                {item.origin}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(248,245,240,0.45)", fontWeight: 300 }}>
                {item.desc}
              </p>

              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 right-0 h-px origin-left"
                style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center max-w-xl mx-auto"
      >
        <p
          className="leading-[2] mb-20"
          style={{ fontSize: "1.1rem", color: SILK_DIM, fontWeight: 300, fontStyle: "italic" }}
        >
          We do not hold sales. We do not hold inventory.
          Each piece is commissioned, crafted once, and delivered
          to a single collector. This is what luxury looks like
          at altitude.
        </p>

        <KineticLink href="/acquire">
          <motion.span
            whileHover={{ letterSpacing: "0.5em" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm tracking-[0.35em] uppercase"
            style={{ color: GOLD, fontWeight: 300, display: "inline-block" }}
          >
            Commission a Piece
          </motion.span>
        </KineticLink>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        viewport={{ once: true }}
        className="absolute bottom-10 left-0 right-0 flex items-center justify-between px-12"
      >
        <span className="text-xs tracking-widest" style={{ color: "rgba(248,245,240,0.2)", fontWeight: 300, fontSize: "0.6rem" }}>
          © Aanp 1938 · Kathmandu
        </span>
        <span className="text-xs tracking-widest" style={{ color: "rgba(248,245,240,0.2)", fontWeight: 300, fontSize: "0.6rem" }}>
          28°N · 84°E
        </span>
      </motion.footer>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ManifestoSection />
      <CollectionSection />
      <ClosingSection />
    </main>
  );
}
