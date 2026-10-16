import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { font, radius } from "../theme";

import React from "react";
import type { ThemeColors } from "../theme";
import { useAppTheme } from "../theme-context";

export function Pill({
  label,
  color,
  faint,
}: {
  label: string;
  color?: string;
  faint?: boolean;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const pillColor = color ?? colors.primary;
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: faint ? colors.primarySoft : withAlpha(pillColor, 0.16) },
      ]}
    >
      <Text style={[styles.pillText, { color: pillColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function LevelBadge({ level }: { level: string }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const c = level === "Beginner" ? colors.green : level === "Intermediate" ? colors.accent : level === "Advanced" ? colors.red : colors.primary;
  return (
    <View style={[styles.levelBadge, { backgroundColor: withAlpha(c, 0.16) }]}>
      <View style={[styles.dot, { backgroundColor: c }]} />
      <Text style={[styles.levelText, { color: c }]}>{level}</Text>
    </View>
  );
}

export function ProgressBar({
  value,
  color,
  height = 10,
}: {
  value: number; // 0..1
  color?: string;
  height?: number;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const barColor = color ?? colors.green;
  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <View
        style={{
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          backgroundColor: barColor,
          height,
          borderRadius: height,
        }}
      />
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return <View style={[styles.card, style]}>{children}</View>;
}

export function GlyphTile({
  glyph,
  color,
  size = 46,
}: {
  glyph: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: withAlpha(color, 0.18),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color, fontWeight: "800", fontSize: size * 0.4 }}>{glyph}</Text>
    </View>
  );
}

export function withAlpha(hex: string, alpha: number) {
  // supports #RRGGBB
  if (hex.startsWith("rgba") || hex.startsWith("rgb")) return hex;
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  pillText: { fontSize: font.tiny, fontWeight: "700" },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  levelText: { fontSize: font.tiny, fontWeight: "700" },
  track: { backgroundColor: colors.borderSoft, width: "100%", overflow: "hidden" },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
});
