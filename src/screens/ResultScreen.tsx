import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { font, radius } from "../theme";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { Mascot } from "../components/Mascot";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import type { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ThemeColors } from "../theme";
import { getCategory } from "../data";
import { useAppTheme } from "../theme-context";
import { useT } from "../i18n";

type Nav = NativeStackNavigationProp<RootStackParamList, "Result">;
type ResultRoute = RouteProp<RootStackParamList, "Result">;

export default function ResultScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<ResultRoute>();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const t = useT();
  const xpValue = useRef(new Animated.Value(0)).current;
  const category = getCategory(params.catSlug);
  const pct = params.total > 0 ? Math.round((params.correct / params.total) * 100) : 0;
  const message = pct >= 80 ? t("result.excellent") : pct >= 50 ? t("result.good") : t("result.keepGoing");

  useEffect(() => {
    Animated.timing(xpValue, { toValue: params.xp, duration: 850, useNativeDriver: false }).start();
  }, [params.xp, xpValue]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Mascot size={142} />
        <Text style={styles.headline}>{message}</Text>
        {params.newRecord ? <Text style={styles.record}>{t("result.newRecord")}</Text> : null}
        <Text style={styles.topic}>{category?.title ?? "Bài luyện hoàn thành"}</Text>
        <View style={styles.scoreRing}>
          <Text testID="result-score" style={styles.percentage}>{pct}%</Text>
          <Text style={styles.scoreLabel}>{t("result.accuracy")}</Text>
        </View>
        <Text style={styles.correct}>{t("result.correctCount", { correct: params.correct, total: params.total })}</Text>
        <View style={styles.xpRow}>
          <Ionicons name="flash" size={23} color={colors.accent} />
          <AnimatedXP value={xpValue} />
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => nav.replace("Exercise", { catSlug: params.catSlug, exId: params.exId })} style={styles.primary}>
          <Ionicons name="refresh" size={19} color="#fff" />
          <Text style={styles.primaryText}>{t("result.retry")}</Text>
        </Pressable>
        <Pressable testID="result-home" onPress={() => nav.popToTop()} style={styles.secondary}>
          <Text style={styles.secondaryText}>{t("result.home")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function AnimatedXP({ value }: { value: Animated.Value }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [display, setDisplay] = React.useState(0);
  useEffect(() => {
    const listener = value.addListener(({ value: current }) => setDisplay(Math.round(current)));
    return () => value.removeListener(listener);
  }, [value]);
  return <Text style={styles.xp}>+{display} XP</Text>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, justifyContent: "space-between" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  headline: { color: colors.text, fontSize: font.h1, fontWeight: "900", marginTop: 8 },
  record: { color: colors.accent, fontSize: font.small, fontWeight: "800", marginTop: 5 },
  topic: { color: colors.textMuted, fontSize: font.small, marginTop: 8, textAlign: "center" },
  scoreRing: { width: 154, height: 154, borderRadius: 77, borderWidth: 9, borderColor: colors.green, alignItems: "center", justifyContent: "center", marginTop: 24 },
  percentage: { color: colors.text, fontSize: 38, fontWeight: "900" },
  scoreLabel: { color: colors.textMuted, fontSize: font.tiny, fontWeight: "700" },
  correct: { color: colors.textMuted, fontSize: font.body, marginTop: 15 },
  xpRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16 },
  xp: { color: colors.accent, fontSize: 24, fontWeight: "900" },
  actions: { padding: 20, gap: 10 },
  primary: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  primaryText: { color: "#fff", fontSize: font.body, fontWeight: "800" },
  secondary: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: colors.textMuted, fontSize: font.small, fontWeight: "700" },
});