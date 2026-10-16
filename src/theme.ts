// Devora design tokens — dark indigo theme inspired by the CodersLingo UI.

export const darkColors = {
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

export const lightColors = {
  bg: "#F5F7FC",
  bgDeep: "#E9EDF6",
  card: "#FFFFFF",
  cardAlt: "#F0F2FA",
  elevated: "#E4E8F4",
  border: "#D8DDEC",
  borderSoft: "#E4E8F2",
  primary: "#5B45D6",
  primaryDark: "#4332AF",
  primarySoft: "rgba(91, 69, 214, 0.12)",
  accent: "#A66500",
  green: "#087A55",
  greenSoft: "rgba(8, 122, 85, 0.12)",
  red: "#C13754",
  redSoft: "rgba(193, 55, 84, 0.12)",
  cyan: "#007F91",
  pink: "#B23A78",
  blue: "#2865B8",
  text: "#17192B",
  textMuted: "#555D73",
  textFaint: "#737B91",
  white: "#FFFFFF",
  black: "#000000",
};

export type ThemeColors = typeof darkColors;
export const colors: ThemeColors = darkColors;

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
