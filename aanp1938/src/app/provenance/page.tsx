import ChapterPage from "@/components/ChapterPage";

export const metadata = {
  title: "Provenance — Aanp 1938",
  description: "Every Aanp piece carries the altitude, the season, and the maker's name. This is provenance at altitude.",
};

export default function ProvenancePage() {
  return (
    <ChapterPage
      eyebrow="Traceable to the Valley"
      title={<>Every piece,<br />a known origin</>}
      lede="Luxury without provenance is only expense. Each Aanp commission arrives with a record that follows it for the rest of its life."
      stanzas={[
        {
          heading: "The Record",
          body: "The maker's name. The valley and its altitude. The season the fibre was spun and the season the piece was finished. The mineral or root that gave it its colour. All of it, hand-inscribed, travels with the piece.",
        },
        {
          heading: "Single Provenance",
          body: "We hold no inventory and no sales. Each design is commissioned, crafted once, and delivered to a single collector. There is never a second of the same piece, and so there is never any question of what you hold.",
        },
        {
          heading: "Across Generations",
          body: "An Aanp piece is made to outlive its first owner. The provenance record is designed to be inherited — so that a granddaughter can know the valley, the season, and the hand that made what she has been given.",
        },
      ]}
    />
  );
}
