import ChapterPage from "@/components/ChapterPage";
import KineticLink from "@/components/KineticLink";

export const metadata = {
  title: "Acquire — Aanp 1938",
  description: "Commission a single, one-of-one Aanp piece. By correspondence only.",
};

export default function AcquirePage() {
  return (
    <ChapterPage
      eyebrow="By Correspondence Only"
      title={<>Commission<br />a single piece</>}
      lede="We do not sell from a shelf. To acquire an Aanp piece is to begin a conversation that may last a season — about the valley, the fibre, and the form you wish to carry."
      stanzas={[
        {
          heading: "The Conversation",
          body: "Every commission begins with a letter. You tell us the occasion, the climate it will live in, and what it should mean. We reply with the valleys and fibres available this season, and the makers who might take it on.",
        },
        {
          heading: "The Wait",
          body: "From the first letter to delivery is rarely less than four months and often longer. We will not rush a maker, and we will not promise a date the mountain cannot keep. Patience is part of what you are acquiring.",
        },
      ]}
    >
      <div className="mt-24 pt-16" style={{ borderTop: "1px solid rgba(212,175,55,0.12)" }}>
        <p
          className="text-sm tracking-[0.2em] uppercase mb-8"
          style={{ color: "rgba(248,245,240,0.45)", fontWeight: 300 }}
        >
          To begin, write to the atelier
        </p>
        <KineticLink href="mailto:atelier@aanp1938.com" external>
          <span
            className="inline-block"
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
              color: "#D4AF37",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}
          >
            atelier@aanp1938.com
          </span>
        </KineticLink>
      </div>
    </ChapterPage>
  );
}
