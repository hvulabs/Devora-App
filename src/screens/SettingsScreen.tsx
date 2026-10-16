import * as Notifications from "expo-notifications";

import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import React, { useEffect } from "react";
import { colors, font, radius } from "../theme";

import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useProgress } from "../store/progress";

type Nav = NativeStackNavigationProp<RootStackParamList, "Settings">;

export default function SettingsScreen() {
  const nav = useNavigation<Nav>();
  const { dailyGoalXp, soundEnabled, remindersEnabled, language, themeMode, updateSettings } = useProgress();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
    });
  }, []);

  const toggleReminders = async (enabled: boolean) => {
    if (!enabled) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      updateSettings({ remindersEnabled: false });
      return;
    }
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Thông báo đang tắt", "Bạn có thể bật quyền thông báo trong Cài đặt của thiết bị.");
      return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: "Devora", body: "Dành vài phút luyện tiếng Anh IT hôm nay nhé." },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 19, minute: 0 },
    });
    updateSettings({ remindersEnabled: true });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => nav.goBack()} style={styles.back}><Ionicons name="chevron-back" size={22} color={colors.text} /><Text style={styles.title}>Cài đặt</Text></Pressable>
        <Text style={styles.section}>MỤC TIÊU HỌC TẬP</Text>
        <View style={styles.row}><View style={styles.rowCopy}><Text style={styles.rowTitle}>Mục tiêu XP mỗi ngày</Text><Text style={styles.rowHint}>{dailyGoalXp} XP</Text></View><View style={styles.stepper}><Pressable onPress={() => updateSettings({ dailyGoalXp: Math.max(20, dailyGoalXp - 10) })} style={styles.step}><Ionicons name="remove" size={18} color={colors.text} /></Pressable><Pressable onPress={() => updateSettings({ dailyGoalXp: Math.min(200, dailyGoalXp + 10) })} style={styles.step}><Ionicons name="add" size={18} color={colors.text} /></Pressable></View></View>
        <Text style={styles.section}>TRẢI NGHIỆM</Text>
        <SettingSwitch icon="volume-high-outline" title="Âm thanh" value={soundEnabled} onChange={(value) => updateSettings({ soundEnabled: value })} />
        <SettingSwitch icon="notifications-outline" title="Nhắc học mỗi ngày" value={remindersEnabled} onChange={toggleReminders} />
        <Text style={styles.section}>NGÔN NGỮ</Text>
        <ChoiceRow options={[{ label: "Theo thiết bị", value: "system" }, { label: "Tiếng Việt", value: "vi" }, { label: "English", value: "en" }]} value={language} onChange={(value) => updateSettings({ language: value as "system" | "vi" | "en" })} />
        <Text style={styles.section}>GIAO DIỆN</Text>
        <ChoiceRow options={[{ label: "Theo thiết bị", value: "system" }, { label: "Tối", value: "dark" }, { label: "Sáng", value: "light" }]} value={themeMode} onChange={(value) => updateSettings({ themeMode: value as "system" | "dark" | "light" })} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingSwitch({ icon, title, value, onChange }: { icon: "volume-high-outline" | "notifications-outline"; title: string; value: boolean; onChange: (value: boolean) => void }) {
  return <View style={styles.row}><Ionicons name={icon} size={20} color={colors.textMuted} /><Text style={styles.rowTitle}>{title}</Text><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.text} /></View>;
}

function ChoiceRow({ options, value, onChange }: { options: { label: string; value: string }[]; value: string; onChange: (value: string) => void }) {
  return <View style={styles.choices}>{options.map((option) => <Pressable key={option.value} onPress={() => onChange(option.value)} style={[styles.choice, value === option.value && styles.choiceActive]}><Text style={[styles.choiceText, value === option.value && styles.choiceTextActive]}>{option.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg }, content: { paddingHorizontal: 18, paddingBottom: 30 },
  back: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 8, paddingBottom: 18 }, title: { color: colors.text, fontSize: font.h2, fontWeight: "900" },
  section: { color: colors.primary, fontSize: font.tiny, fontWeight: "900", letterSpacing: 1, marginTop: 20, marginBottom: 8 },
  row: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12, borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }, rowCopy: { flex: 1 }, rowTitle: { flex: 1, color: colors.text, fontSize: font.small, fontWeight: "700" }, rowHint: { color: colors.textMuted, fontSize: font.tiny, marginTop: 4 },
  stepper: { flexDirection: "row", gap: 8 }, step: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.card, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  choices: { flexDirection: "row", gap: 7 }, choice: { flex: 1, minHeight: 42, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 }, choiceActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary }, choiceText: { color: colors.textMuted, fontSize: font.tiny, fontWeight: "700", textAlign: "center" }, choiceTextActive: { color: colors.primary },
});