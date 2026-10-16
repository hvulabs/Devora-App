import { Pressable, StyleSheet, Text } from "react-native";
import { font, radius } from "../theme";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import type { ThemeColors } from "../theme";
import { useAppTheme } from "../theme-context";

interface OptionButtonProps {
  option: string;
  index: number;
  selectedIndex: number | null;
  correctIndex: number;
  onSelect: (index: number) => void;
}

export function OptionButton({ option, index, selectedIndex, correctIndex, onSelect }: OptionButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const isCorrect = selectedIndex !== null && index === correctIndex;
  const isWrong = selectedIndex === index && index !== correctIndex;

  return (
    <Pressable
      testID={`exercise-option-${index}`}
      accessibilityRole="button"
      onPress={() => onSelect(index)}
      disabled={selectedIndex !== null}
      style={[styles.option, isCorrect && styles.correctOption, isWrong && styles.wrongOption]}
    >
      <Text style={[styles.optionLetter, isCorrect && styles.correctLetter, isWrong && styles.wrongLetter]}>{String.fromCharCode(65 + index)}</Text>
      <Text style={styles.optionText}>{option}</Text>
      {isCorrect ? <Ionicons name="checkmark-circle" size={21} color={colors.green} /> : null}
      {isWrong ? <Ionicons name="close-circle" size={21} color={colors.red} /> : null}
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  option: { minHeight: 60, flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  optionLetter: { color: colors.textMuted, backgroundColor: colors.elevated, width: 32, height: 32, textAlign: "center", textAlignVertical: "center", borderRadius: 16, fontWeight: "800", overflow: "hidden" },
  optionText: { flex: 1, color: colors.text, fontSize: font.small, lineHeight: 21 },
  correctOption: { borderColor: colors.green, backgroundColor: colors.greenSoft },
  wrongOption: { borderColor: colors.red, backgroundColor: colors.redSoft },
  correctLetter: { color: colors.green, backgroundColor: "rgba(52,211,153,0.18)" },
  wrongLetter: { color: colors.red, backgroundColor: "rgba(251,113,133,0.18)" },
});