// Devora design tokens — dark indigo theme inspired by the CodersLingo UI.

export const colors = {
  bg: "#15132A",
  bgDeep: "#100E22",
  card: "#211E3A",
  cardAlt: "#262241",
  elevated: "#2C2850",
  border: "#322C56",
  borderSoft: "#2A2548",

  primary: "#7C5CFF",
  primaryDark: "#4F46E5",
  primarySoft: "rgba(124, 92, 255, 0.16)",

  accent: "#FCD34D",
  green: "#34D399",
  greenSoft: "rgba(52, 211, 153, 0.16)",
  red: "#FB7185",
  redSoft: "rgba(251, 113, 133, 0.16)",
  cyan: "#22D3EE",
  pink: "#F472B6",
  blue: "#60A5FA",

  text: "#F5F3FF",
  textMuted: "#A59FCB",
  textFaint: "#6F699A",

  white: "#FFFFFF",
  black: "#000000",
};

export const gradients = {
  brand: ["#7C4DFF", "#4F46E5"] as const,
  brandSoft: ["#2A2458", "#1B1838"] as const,
  card: ["#252142", "#1E1B38"] as const,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const spacing = (n: number) => n * 4;

export const font = {
  h1: 30,
  h2: 24,
  h3: 20,
  body: 16,
  small: 14,
  tiny: 12,
};

export const levelColor: Record<string, string> = {
  Beginner: colors.green,
  Intermediate: colors.accent,
  Advanced: colors.red,
};
