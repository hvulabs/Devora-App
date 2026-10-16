import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { RootStackParamList, TabParamList } from "../navigation/types";
import { colors, font, radius } from "../theme";

import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MascotBadge } from "../components/Mascot";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useProgress } from "../store/progress";

type Nav = CompositeNavigationProp<BottomTabNavigationProp<TabParamList, "Profile">, NativeStackNavigationProp<RootStackParamList>>;

export default function ProfileScreen() {
  const nav = useNavigation<Nav>();
  const { xp, streak, completed, badges, provider, displayName, signOut, reset } = useProgress();
  const recent = Object.entries(completed).sort((a, b) => b[1].completedAt - a[1].completedAt).slice(0, 8);

  const clearProgress = () => Alert.alert("Xoá tiến độ?", "XP, streak, huy hiệu và lịch sử bài luyện sẽ được đặt lại.", [
    { text: "Huỷ", style: "cancel" },
    { text: "Xoá", style: "destructive", onPress: reset },
  ]);
  const logout = () => Alert.alert("Đăng xuất?", "Tiến độ đã lưu trên thiết bị vẫn được giữ.", [
    { text: "Ở lại", style: "cancel" },
    { text: "Đăng xuất", style: "destructive", onPress: () => {
      signOut();
      nav.getParent()?.reset({ index: 0, routes: [{ name: "Auth" }] });
    } },
  ]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={recent}
        keyExtractor={([id]) => id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.titleRow}><Text style={styles.title}>Hồ sơ</Text><Pressable onPress={() => nav.navigate("Settings")} hitSlop={10}><Ionicons name="settings-outline" size={23} color={colors.textMuted} /></Pressable></View>
            <View style={styles.identity}><MascotBadge size={56} /><View style={styles.identityText}><Text style={styles.name}>{displayName || (provider ? `Tài khoản ${provider}` : "Người học Devora")}</Text><Text style={styles.caption}>{provider ? `Đăng nhập với ${provider}` : "Đang học với tư cách khách"}</Text></View></View>
            <View style={styles.stats}>
              <Stat icon="flash" value={`${xp}`} label="Tổng XP" color={colors.accent} />
              <Stat icon="flame" value={`${streak}`} label="Ngày streak" color={colors.pink} />
              <Stat icon="checkmark-done" value={`${Object.keys(completed).length}`} label="Bài hoàn tất" color={colors.green} />
            </View>
            <Text style={styles.section}>HUY HIỆU · {badges.length}</Text>
            {badges.length ? <View style={styles.badges}>{badges.map((badge) => <View key={badge} style={styles.badge}><Ionicons name="ribbon" size={16} color={colors.accent} /><Text style={styles.badgeText}>{badge.replace("xp-", "").replace("streak-", "")}{badge.startsWith("xp-") ? " XP" : " ngày"}</Text></View>)}</View> : <Text style={styles.empty}>Hoàn thành bài luyện để nhận huy hiệu.</Text>}
            <Text style={styles.section}>BÀI GẦN ĐÂY</Text>
          </>
        }
        renderItem={({ item: [id, result] }) => (
          <View style={styles.recent}><View style={styles.recentCopy}><Text style={styles.recentTitle} numberOfLines={1}>{id.split("__").slice(1).join(" ").replaceAll("-", " ")}</Text><Text style={styles.caption}>{new Date(result.completedAt).toLocaleDateString()} · tốt nhất {result.bestPct}%</Text></View><Ionicons name="checkmark-circle" size={20} color={colors.green} /></View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Bạn chưa hoàn thành bài luyện nào.</Text>}
        ListFooterComponent={<View style={styles.actions}><Pressable onPress={() => nav.navigate("Settings")} style={styles.action}><Ionicons name="options-outline" size={19} color={colors.text} /><Text style={styles.actionText}>Cài đặt</Text><Ionicons name="chevron-forward" size={18} color={colors.textFaint} /></Pressable><Pressable onPress={clearProgress} style={styles.action}><Ionicons name="trash-outline" size={19} color={colors.red} /><Text style={[styles.actionText, { color: colors.red }]}>Xoá tiến độ</Text></Pressable><Pressable onPress={logout} style={styles.action}><Ionicons name="log-out-outline" size={19} color={colors.textMuted} /><Text style={styles.actionText}>Đăng xuất</Text></Pressable></View>}
      />
    </SafeAreaView>
  );
}

function Stat({ icon, value, label, color }: { icon: "flash" | "flame" | "checkmark-done"; value: string; label: string; color: string }) {
  return <View style={styles.stat}><Ionicons name={icon} size={19} color={color} /><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg }, content: { padding: 18, paddingBottom: 28 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, title: { color: colors.text, fontSize: font.h1, fontWeight: "900" },
  identity: { flexDirection: "row", alignItems: "center", gap: 13, marginTop: 22 }, identityText: { flex: 1 }, name: { color: colors.text, fontSize: font.body, fontWeight: "800" }, caption: { color: colors.textMuted, fontSize: font.tiny, marginTop: 4, textTransform: "capitalize" },
  stats: { flexDirection: "row", gap: 9, marginTop: 22 }, stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: "center", paddingVertical: 13, paddingHorizontal: 4 }, statValue: { color: colors.text, fontSize: 19, fontWeight: "900", marginTop: 6 }, statLabel: { color: colors.textMuted, fontSize: 10, marginTop: 3, textAlign: "center" },
  section: { color: colors.primary, fontSize: font.tiny, fontWeight: "900", letterSpacing: 1, marginTop: 26, marginBottom: 10 }, badges: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, badge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 8 }, badgeText: { color: colors.text, fontSize: font.tiny, fontWeight: "700" },
  recent: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }, recentCopy: { flex: 1 }, recentTitle: { color: colors.text, fontSize: font.small, fontWeight: "700", textTransform: "capitalize" }, empty: { color: colors.textMuted, fontSize: font.small, paddingVertical: 12 },
  actions: { marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border }, action: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }, actionText: { flex: 1, color: colors.text, fontSize: font.small, fontWeight: "700" },
});