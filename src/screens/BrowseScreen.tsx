import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { catalog } from "../data";
import { colors, radius, font } from "../theme";
import { CategoryCard } from "./HomeScreen";
import { withAlpha } from "../components/ui";

type Nav = NativeStackNavigationProp<RootStackParamList, "Browse">;

export default function BrowseScreen() {
  const nav = useNavigation<Nav>();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return catalog.categories.filter((c) => {
      if (group && c.group !== group) return false;
      if (!needle) return true;
      return (
        c.title.toLowerCase().includes(needle) ||
        c.group.toLowerCase().includes(needle)
      );
    });
  }, [q, group]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerWrap}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => nav.goBack()} style={styles.back} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.h1}>Khám phá</Text>
        </View>
        <Text style={styles.sub}>
          {catalog.categories.length} chủ đề · chọn và bắt đầu trong 5 giây
        </Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textFaint} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Tìm chủ đề..."
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
          <Chip label="Tất cả" active={!group} onPress={() => setGroup(null)} />
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
          <Text style={styles.empty}>Không tìm thấy chủ đề phù hợp.</Text>
        }
      />
    </SafeAreaView>
  );
}

function Chip({
  label,
  active,
  color = colors.primary,
  onPress,
}: {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active
          ? { backgroundColor: withAlpha(color, 0.2), borderColor: color }
          : { borderColor: colors.border },
      ]}
    >
      <Text style={[styles.chipText, { color: active ? color : colors.textMuted }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
