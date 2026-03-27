import { BROWN, LATO, ORANGE } from "@/lib/helper";
import SectionHeading from "../section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is wood-pressed healthier than refined groundnut oil?",
    a: "Yes. The cold-pressing process operates below 45°C, preserving naturally occurring Vitamin E, antioxidants, and essential fatty acids. Refined oil uses high heat and chemical solvents that strip away these nutrients.",
  },
  {
    q: "What is the shelf life of this oil?",
    a: "9 months from the date of manufacture when stored cool and dry, away from direct sunlight. After opening, use within 2–3 months for best flavour and nutritional quality.",
  },
  {
    q: "Why does the oil appear slightly cloudy or have sediment?",
    a: "Cloudiness and natural sediment are a sign of quality! Unlike refined oils, our wood-pressed oil retains natural waxes, proteins, and micro-nutrients that may settle. Simply shake before use.",
  },
  {
    q: "Can I use this oil for deep frying?",
    a: "Absolutely. With a smoke point of approximately 230°C, it is ideal for deep-frying, tempering, stir-frying, and baking. Its high stability under heat makes it one of the best oils for everyday Indian cooking.",
  },
  {
    q: "How is purity verified?",
    a: "Every batch undergoes independent third-party lab testing for free fatty acid content, peroxide value, adulteration, and heavy metal contamination. We publish these lab reports for complete transparency.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-16 px-6 max-w-3xl mx-auto">
      <SectionHeading>
        Frequently{" "}
        <em style={{ color: ORANGE, fontStyle: "italic" }}>Asked Questions</em>
      </SectionHeading>
      <Accordion type="single" collapsible className="flex flex-col gap-3">
        {FAQS.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="rounded-xl overflow-hidden px-5"
            style={{
              border: `1px solid #f0e6dc`,
              background: "#fdfaf7",
            }}
          >
            <AccordionTrigger
              className="text-left font-bold text-sm py-4 hover:no-underline"
              style={{ color: BROWN, fontFamily: LATO }}
            >
              {faq.q}
            </AccordionTrigger>
            <AccordionContent
              className="text-sm leading-7 pb-4"
              style={{ color: "#9a7a6e", fontFamily: LATO }}
            >
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default FaqSection;