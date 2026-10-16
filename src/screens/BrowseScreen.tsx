import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import type { RootStackParamList, TabParamList } from "../navigation/types";
import { font, radius } from "../theme";

import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CategoryCard } from "./HomeScreen";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ThemeColors } from "../theme";
import { catalog } from "../data";
import { filterCategories } from "../data/filterCategories";
import { useAppTheme } from "../theme-context";
import { useNavigation } from "@react-navigation/native";
import { useT } from "../i18n";
import { withAlpha } from "../components/ui";

type Nav = CompositeNavigationProp<BottomTabNavigationProp<TabParamList, "Browse">, NativeStackNavigationProp<RootStackParamList>>;

export default function BrowseScreen() {
  const nav = useNavigation<Nav>();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const t = useT();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string | null>(null);

  const filtered = useMemo(() => filterCategories(catalog.categories, q, group), [q, group]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerWrap}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => nav.goBack()} style={styles.back} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.h1}>{t("browse.title")}</Text>
        </View>
        <Text style={styles.sub}>
          {t("browse.subtitle", { count: catalog.categories.length })}
        </Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={t("browse.search")}
            placeholderTextColor={colors.textFaint}
            style={styles.searchInput}
          />
          {q ? (
            <Pressable onPress={() => setQ("")}>
              <Ionicons name="close-circle" size={18} color={colors.textFaint} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
        >
          <Chip label={t("browse.all")} active={!group} onPress={() => setGroup(null)} />
          {catalog.groups.map((g) => (
            <Chip
              key={g.name}
              label={g.name}
              color={g.color}
              active={group === g.name}
              onPress={() => setGroup(group === g.name ? null : g.name)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.slug}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <CategoryCard cat={item} onPress={() => nav.navigate("Category", { slug: item.slug })} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>{t("browse.empty")}</Text>
        }
      />
    </SafeAreaView>
  );
}

function Chip({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const chipColor = color ?? colors.primary;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active
          ? { backgroundColor: withAlpha(chipColor, 0.2), borderColor: chipColor }
          : { borderColor: colors.border },
      ]}
    >
      <Text style={[styles.chipText, { color: active ? chipColor : colors.textMuted }]}> 
        {label}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  headerWrap: { paddingHorizontal: 16, paddingTop: 6, gap: 12, paddingBottom: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  back: { padding: 2 },
  h1: { color: colors.text, fontSize: font.h1, fontWeight: "900" },
  sub: { color: colors.textMuted, fontSize: font.small, marginTop: -6 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: font.body },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  chipText: { fontWeight: "700", fontSize: font.small },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
});
