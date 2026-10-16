import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GlyphTile, withAlpha } from "../components/ui";
import React, { useMemo } from "react";
import type { RootStackParamList, TabParamList } from "../navigation/types";
import Svg, { Circle } from "react-native-svg";
import { catalog, totalExercises, totalQuestions } from "../data";
import { font, gradients, radius } from "../theme";

import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { Category } from "../types";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MascotBadge } from "../components/Mascot";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ThemeColors } from "../theme";
import { useAppTheme } from "../theme-context";
import { useNavigation } from "@react-navigation/native";
import { useProgress } from "../store/progress";
import { useT } from "../i18n";

type Nav = CompositeNavigationProp<BottomTabNavigationProp<TabParamList, "Home">, NativeStackNavigationProp<RootStackParamList>>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { colors, isDark } = useAppTheme();
  const styles = createStyles(colors);
  const t = useT();
  const { xp, dailyXp, dailyGoalXp, streak, lastActiveDay } = useProgress();
  const todayXp = lastActiveDay === localDayKey() ? dailyXp : 0;
  const activeStreak = streak > 0 && lastActiveDay === previousDayKey();

  const featured = useMemo(() => {
    const cat = catalog.categories[0];
    const ex = cat.exercises[0];
    return { cat, ex };
  }, []);

  const grid = catalog.categories.slice(0, 12);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <MascotBadge size={34} />
            <Text style={styles.brand}>devora</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Ionicons name="flame" size={16} color={colors.accent} />
              <Text style={styles.statChipText}>{streak}</Text>
            </View>
            <View style={styles.statChip}>
              <Ionicons name="flash" size={15} color={colors.primary} />
              <Text style={styles.statChipText}>{xp} XP</Text>
            </View>
          </View>
        </View>

        {/* hero */}
        <View style={styles.block}>
          <Text style={styles.heroKicker}>{t("home.kicker")}</Text>
          <Text style={styles.heroTitle}>{t("home.heroTitle")}</Text>
          <Text style={styles.heroSub}>{t("home.subtitle")}</Text>

          <LinearGradient
            colors={isDark ? gradients.brand : ["#6956D9", "#3D72B8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroCardTop}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText} numberOfLines={1}>
                  {featured.cat.title}
                </Text>
              </View>
              <View style={styles.xpBadge}>
                <Ionicons name="flash" size={13} color={colors.accent} />
                <Text style={styles.xpBadgeText}>{featured.ex.xp} XP</Text>
              </View>
            </View>
            <Text style={styles.heroQ} numberOfLines={3}>
              {featured.ex.title}
            </Text>
            {featured.ex.subtitle ? (
              <Text style={styles.heroQSub} numberOfLines={2}>
                {featured.ex.subtitle}
              </Text>
            ) : null}
            <Pressable
              testID="home-featured-exercise"
              style={styles.heroCta}
              onPress={() => nav.navigate("Exercise", { catSlug: featured.cat.slug, exId: featured.ex.id })}
            >
              <Text style={styles.heroCtaText}>{t("home.start")}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </LinearGradient>
        </View>

        {/* stats */}
        <View style={styles.statCards}>
          <StatCard big={`${(totalQuestions / 1000).toFixed(1)}k+`} label={t("home.questions")} color={colors.pink} />
          <StatCard big={`${totalExercises}+`} label={t("home.exercises")} color={colors.green} />
          <StatCard big={`${catalog.categories.length}`} label={t("home.topics")} color={colors.cyan} />
        </View>

        <View style={styles.goalBlock}>
          <View style={styles.goalRing}>
            <Svg width={68} height={68} viewBox="0 0 68 68">
              <Circle cx={34} cy={34} r={28} stroke={colors.border} strokeWidth={6} fill="none" />
              <Circle cx={34} cy={34} r={28} stroke={colors.green} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={`${Math.min(1, todayXp / dailyGoalXp) * 176} 176`} rotation={-90} origin="34, 34" />
            </Svg>
            <Text style={styles.goalRingText}>{Math.min(100, Math.round((todayXp / dailyGoalXp) * 100))}%</Text>
          </View>
          <View style={styles.goalCopy}>
            <Text style={styles.sectionLabel}>{t("home.dailyGoal")}</Text>
            <Text style={styles.goalProgress}>{t("home.goalProgress", { current: todayXp, goal: dailyGoalXp })}</Text>
            <Text style={styles.goalReminder}>{lastActiveDay === localDayKey() ? "" : t(activeStreak ? "home.keepStreak" : "home.startStreak", { count: streak })}</Text>
          </View>
        </View>

        {/* groups */}
        <View style={styles.block}>
          <Text style={styles.sectionLabel}>{t("home.paths")}</Text>
          <Text style={styles.sectionTitle}>{t("home.pathQuestion")}</Text>
          <FlatList
            data={catalog.groups}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(g) => g.name}
            contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
            renderItem={({ item }) => (
              <View
                style={[styles.groupChip, { borderColor: withAlpha(item.color, 0.4) }]}
              >
                <View style={[styles.groupDot, { backgroundColor: item.color }]} />
                <Text style={styles.groupChipText}>{item.name}</Text>
                <Text style={styles.groupChipCount}>{item.slugs.length}</Text>
              </View>
            )}
          />
        </View>

        {/* category grid */}
        <View style={styles.block}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.sectionLabel}>{t("home.practice")}</Text>
              <Text style={styles.sectionTitle}>{t("home.chooseTopic")}</Text>
            </View>
            <Pressable style={styles.seeAll} onPress={() => nav.navigate("Browse")}>
              <Text style={styles.seeAllText}>{t("home.allTopics", { count: catalog.categories.length })}</Text>
            </Pressable>
          </View>

          <View style={styles.grid}>
            {grid.map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} onPress={() => nav.navigate("Category", { slug: cat.slug })} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ big, label, color }: { big: string; label: string; color: string }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statBig, { color }]}>{big}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function CategoryCard({ cat, onPress }: { cat: Category; onPress?: () => void }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const t = useT();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.catCard, pressed && { opacity: 0.85 }]}>
      <GlyphTile glyph={cat.glyph} color={cat.color} />
      <Text style={styles.catTitle} numberOfLines={2}>
        {cat.title}
      </Text>
      <View style={styles.catMetaRow}>
        <Text style={styles.catMeta}>{cat.exerciseCount} {t("home.exercises")}</Text>
        <View style={styles.catMetaDot} />
        <Text style={styles.catMeta}>{cat.questionCount} {t("home.questions")}</Text>
      </View>
    </Pressable>
  );
}

function localDayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function previousDayKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return localDayKey(yesterday);
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brand: { fontSize: 20, fontWeight: "800", color: colors.primary },
  statsRow: { flexDirection: "row", gap: 8 },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  statChipText: { color: colors.text, fontWeight: "700", fontSize: font.small },

  block: { paddingHorizontal: 16, marginTop: 18 },
  heroKicker: { color: colors.text, fontSize: 26, fontWeight: "900" },
  heroTitle: { color: colors.primary, fontSize: 26, fontWeight: "900", marginTop: -2 },
  heroSub: { color: colors.textMuted, fontSize: font.small, marginTop: 8, lineHeight: 20 },

  heroCard: { borderRadius: radius.xl, padding: 18, marginTop: 16 },
  heroCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTag: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    maxWidth: "70%",
  },
  heroTagText: { color: "#fff", fontWeight: "700", fontSize: font.tiny },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.22)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  xpBadgeText: { color: "#fff", fontWeight: "700", fontSize: font.tiny },
  heroQ: { color: "#fff", fontSize: font.h3, fontWeight: "800", marginTop: 16, lineHeight: 26 },
  heroQSub: { color: "rgba(255,255,255,0.82)", fontSize: font.small, marginTop: 8, lineHeight: 20 },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  heroCtaText: { color: "#fff", fontWeight: "800", fontSize: font.small },

  statCards: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 18 },
  goalBlock: { flexDirection: "row", alignItems: "center", gap: 14, marginHorizontal: 16, marginTop: 14, padding: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  goalRing: { width: 68, height: 68, alignItems: "center", justifyContent: "center" },
  goalRingText: { position: "absolute", color: colors.text, fontSize: font.small, fontWeight: "900" },
  goalCopy: { flex: 1 },
  goalProgress: { color: colors.text, fontSize: font.body, fontWeight: "800", marginTop: 4 },
  goalReminder: { color: colors.textMuted, fontSize: font.tiny, marginTop: 4 },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
  },
  statBig: { fontSize: 22, fontWeight: "900" },
  statLabel: { color: colors.textMuted, fontSize: font.tiny, marginTop: 2 },

  sectionLabel: { color: colors.primary, fontSize: font.tiny, fontWeight: "800", letterSpacing: 1 },
  sectionTitle: { color: colors.text, fontSize: font.h3, fontWeight: "800", marginTop: 4, marginBottom: 10 },

  groupChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  groupDot: { width: 9, height: 9, borderRadius: 5 },
  groupChipText: { color: colors.text, fontWeight: "700", fontSize: font.small },
  groupChipCount: {
    color: colors.textFaint,
    fontWeight: "700",
    fontSize: font.tiny,
    backgroundColor: colors.elevated,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: "hidden",
  },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  seeAll: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  seeAllText: { color: colors.text, fontWeight: "700", fontSize: font.tiny },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 6 },
  catCard: {
    width: "48.5%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
  },
  catTitle: { color: colors.text, fontWeight: "800", fontSize: font.body, marginTop: 12, lineHeight: 21 },
  catMetaRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 8 },
  catMeta: { color: colors.textMuted, fontSize: font.tiny, fontWeight: "600" },
  catMetaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textFaint },
});
