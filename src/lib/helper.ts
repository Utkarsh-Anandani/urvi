// slug generator
export const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Theme
export const GREEN        = "#166534";
export const GREEN_LIGHT  = "#16a34a";
export const GREEN_MID    = "#15803d";
export const GOLD         = "#B8960C";
export const GOLD_LIGHT   = "#D4AF37";
export const LATO         = "'Lato', sans-serif";
export const CORMORANT    = "'Cormorant Garamond', Georgia, serif";