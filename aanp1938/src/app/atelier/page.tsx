import ChapterPage from "@/components/ChapterPage";

export const metadata = {
  title: "Atelier — Aanp 1938",
  description: "Inside the high-altitude workshop where each Aanp piece is commissioned and crafted once.",
};

export default function AtelierPage() {
  return (
    <ChapterPage
      eyebrow="The Workshop"
      title={<>Where altitude<br />becomes cloth</>}
      lede="Our atelier sits at 3,500 metres, where the air is thin enough that the dye colours deepen and the silk dries slowly, evenly, without ever being rushed."
      stanzas={[
        {
          heading: "The Fibre",
          body: "Pashmina from the underbelly of high-pasture goats. Eri and raw silk reeled in Palpa. Each fibre is sorted by hand against the light, and only the longest, finest strands are kept. The rest is returned to the village.",
        },
        {
          heading: "The Dye",
          body: "Mineral pigments, indigo, turmeric, and roots that grow only above 3,000 metres. No two batches are identical, and we do not try to make them so. The variation is the signature of the mountain itself.",
        },
        {
          heading: "The Hand",
          body: "Between 200 and 400 hours of weaving and embroidery per piece. The Newari motifs are passed from maker to apprentice by sight alone — there are no pattern books, only memory and the steadiness of the hand.",
        },
      ]}
    />
  );
}
