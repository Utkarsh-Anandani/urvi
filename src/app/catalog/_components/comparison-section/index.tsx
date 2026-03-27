import { BROWN, LATO, LIGHT_BROWN, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import SectionHeading from "../section-heading";

const ComparisonSection = () => {
  const oils = ["Groundnut", "Mustard", "Coconut", "Sunflower", "Sesame"];
  const rows = [
    {
      label: "Best Uses",
      vals: [
        "Frying, Sautéing, Baking, Salads",
        "Cooking, Pickling, Massage",
        "Cooking, Massage, Skincare",
        "Frying, Baking, Dressings",
        "Cooking, Massage",
      ],
    },
    {
      label: "Smoke Point",
      vals: [
        "~230°C (High)",
        "~250°C (Very High)",
        "~177°C (Medium)",
        "~225°C (High)",
        "~210°C (High)",
      ],
    },
    {
      label: "Suitable Weather",
      vals: [
        "Any Weather",
        "Any Weather",
        "Dry & Cool",
        "Dry & Warm",
        "Cool Weather",
      ],
    },
    {
      label: "Key Benefit",
      vals: [
        "Skin & Gut Health",
        "Heart & Gut Health",
        "Metabolism & Skin",
        "Cell Protection",
        "Bone Health",
      ],
    },
    {
      label: "Aroma",
      vals: [
        "Sweet Nutty",
        "Strong Pungent",
        "Sweet Coconut",
        "Mild Nutty",
        "Strong Earthy",
      ],
    },
    {
      label: "Vitamin E (RDA)",
      vals: ["16%", "45%", "20%", "40%", "4% Vit K"],
    },
  ];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <SectionHeading>
        Make a{" "}
        <em style={{ color: ORANGE, fontStyle: "italic" }}>
          Conscious Wellness Choice
        </em>
      </SectionHeading>

      <div
        className="overflow-x-auto rounded-2xl"
        style={{ border: `1px solid #f0e6dc` }}
      >
        <table
          className="w-full text-sm"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ background: BROWN }}>
              <th
                className="text-left px-5 py-4 font-bold text-xs uppercase tracking-wide"
                style={{ color: "rgba(255,255,255,0.6)", fontFamily: LATO }}
              >
                Property
              </th>
              {oils.map((oil, i) => (
                <th
                  key={i}
                  className="text-left px-5 py-4 font-bold text-xs uppercase tracking-wide"
                  style={{
                    color: i === 0 ? LIGHTER_ORANGE : "rgba(255,255,255,0.8)",
                    fontFamily: LATO,
                  }}
                >
                  {oil} {i === 0 && "✦"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  background: ri % 2 === 0 ? "#fdfaf7" : "#fff",
                  borderBottom: `1px solid #f0e6dc`,
                }}
              >
                <td
                  className="px-5 py-3.5 font-bold text-xs uppercase tracking-wide"
                  style={{
                    color: BROWN,
                    fontFamily: LATO,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.label}
                </td>
                {row.vals.map((v, vi) => (
                  <td
                    key={vi}
                    className="px-5 py-3.5"
                    style={{
                      color: vi === 0 ? LIGHT_BROWN : "#6b5a52",
                      fontFamily: LATO,
                      fontWeight: vi === 0 ? 600 : 400,
                    }}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ComparisonSection;