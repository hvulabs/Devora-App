import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { getCategory } from "../data";
import { useProgress } from "../store/progress";
import { colors, font, radius } from "../theme";
import { GlyphTile, LevelBadge } from "../components/ui";

type Nav = NativeStackNavigationProp<RootStackParamList, "Category">;
type CategoryRoute = RouteProp<RootStackParamList, "Category">;

export default function CategoryScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<CategoryRoute>();
  const { completed } = useProgress();
  const category = getCategory(params.slug);

  if (!category) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => nav.goBack()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
          <Text style={styles.title}>Không tìm thấy chủ đề</Text>
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
        <Text style={styles.meta}>{category.exerciseCount} bài · {category.questionCount} câu hỏi</Text>
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
                {result ? <Text style={styles.progress}>{result.bestPct}% tốt nhất</Text> : null}
              </View>
              <Text style={styles.exerciseTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text> : null}
              <View style={styles.exerciseMeta}>
                <Text style={styles.metaText}>{item.count} câu</Text>
                <Text style={styles.metaText}>+{item.xp} XP</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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