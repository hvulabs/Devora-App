import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { GlyphTile, LevelBadge } from "../components/ui";
import { font, radius } from "../theme";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import type { RootStackParamList } from "../navigation/types";
import type { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ThemeColors } from "../theme";
import { getCategory } from "../data";
import { useAppTheme } from "../theme-context";
import { useProgress } from "../store/progress";
import { useT } from "../i18n";

type Nav = NativeStackNavigationProp<RootStackParamList, "Category">;
type CategoryRoute = RouteProp<RootStackParamList, "Category">;

export default function CategoryScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<CategoryRoute>();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const t = useT();
  const { completed } = useProgress();
  const category = getCategory(params.slug);

  if (!category) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => nav.goBack()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
          <Text style={styles.title}>{t("category.notFound")}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => nav.goBack()} style={styles.back} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <GlyphTile glyph={category.glyph} color={category.color} size={54} />
        <Text style={styles.title}>{category.title}</Text>
        <Text style={styles.group}>{category.group}</Text>
        <Text style={styles.meta}>{t("category.counts", { exercises: category.exerciseCount, questions: category.questionCount })}</Text>
      </View>
      <FlatList
        data={category.exercises}
        keyExtractor={(exercise) => exercise.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const result = completed[item.id];
          return (
            <Pressable
              onPress={() => nav.navigate("Exercise", { catSlug: category.slug, exId: item.id })}
              style={({ pressed }) => [styles.exercise, pressed && styles.pressed]}
            >
              <View style={styles.exerciseTop}>
                <LevelBadge level={item.level} />
                {result ? <Text style={styles.progress}>{t("category.best", { percent: result.bestPct })}</Text> : null}
              </View>
              <Text style={styles.exerciseTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text> : null}
              <View style={styles.exerciseMeta}>
                <Text style={styles.metaText}>{t("category.questions", { count: item.count })}</Text>
                <Text style={styles.metaText}>{t("category.xp", { count: item.xp })}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 18, alignItems: "center" },
  back: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8 },
  title: { color: colors.text, fontSize: font.h2, fontWeight: "900", marginTop: 12, textAlign: "center" },
  group: { color: colors.primary, fontSize: font.small, fontWeight: "700", marginTop: 6 },
  meta: { color: colors.textMuted, fontSize: font.small, marginTop: 7 },
  list: { paddingHorizontal: 16, paddingBottom: 28, gap: 10 },
  exercise: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: 15 },
  pressed: { opacity: 0.8 },
  exerciseTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progress: { color: colors.green, fontSize: font.tiny, fontWeight: "700" },
  exerciseTitle: { color: colors.text, fontSize: font.body, fontWeight: "800", marginTop: 12, lineHeight: 22 },
  subtitle: { color: colors.textMuted, fontSize: font.small, lineHeight: 19, marginTop: 6 },
  exerciseMeta: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 13 },
  metaText: { color: colors.textMuted, fontSize: font.tiny, fontWeight: "700" },
});