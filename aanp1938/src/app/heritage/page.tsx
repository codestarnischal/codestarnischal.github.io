import ChapterPage from "@/components/ChapterPage";

export const metadata = {
  title: "Heritage — Aanp 1938",
  description: "The lineage of a high-altitude atelier, told through eighty-six years of mountain craft.",
};

export default function HeritagePage() {
  return (
    <ChapterPage
      eyebrow="Since 1938"
      title={<>A lineage<br />read in thread</>}
      lede="Aanp was not founded in a boardroom. It began in a stone house above the treeline, where the first weaver learned to read the altitude in her fingers."
      stanzas={[
        {
          heading: "The First Loom",
          body: "In the winter of 1938, before roads reached the valley, a single loom was carried over the pass on the back of a mule. It still stands in our atelier — worn smooth by four generations of hands, never replaced, never retired.",
        },
        {
          heading: "Mountain Time",
          body: "We do not measure craft in hours but in seasons. A piece begins when the snow recedes and the dye-roots can be harvested, and it is finished only when the maker decides it is finished. There is no other clock.",
        },
        {
          heading: "An Unbroken Thread",
          body: "Every collector who acquires an Aanp piece receives the name of the maker, the altitude of the valley where the fibre was spun, and the season of its making. Provenance is not a certificate. It is a promise kept across decades.",
        },
      ]}
    />
  );
}
