// slug generator
export const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

// Theme
export const GREEN = "#166534";
export const GREEN_LIGHT = "#16a34a";
export const GREEN_MID = "#15803d";
export const GOLD = "#B8960C";
export const GOLD_LIGHT = "#D4AF37";
export const LATO = "'Lato', sans-serif";
export const CORMORANT = "'Cormorant Garamond', Georgia, serif";
export const ORANGE = "#f7841f";
export const LIGHT_ORANGE = "#f09d55";
export const LIGHTER_ORANGE= "#f2d9c3";
export const BROWN = "#551305";
export const LIGHT_BROWN = "#6f3023";
export const LIGHTER_BROWN = "#8f6d65";
