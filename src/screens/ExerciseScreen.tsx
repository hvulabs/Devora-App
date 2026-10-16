import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { getCategory, getExercise } from "../data";
import { useProgress } from "../store/progress";
import { colors, font, radius } from "../theme";
import { ProgressBar } from "../components/ui";

type Nav = NativeStackNavigationProp<RootStackParamList, "Exercise">;
type ExerciseRoute = RouteProp<RootStackParamList, "Exercise">;

export default function ExerciseScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<ExerciseRoute>();
  const { completed, recordResult } = useProgress();
  const exercise = getExercise(params.catSlug, params.exId);
  const category = getCategory(params.catSlug);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  if (!exercise || exercise.questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>Không tải được bài luyện.</Text>
        <Pressable onPress={() => nav.goBack()} style={styles.primaryButton}><Text style={styles.primaryText}>Quay lại</Text></Pressable>
      </SafeAreaView>
    );
  }

  const question = exercise.questions[index];
  const total = exercise.questions.length;
  const exerciseMeta = category?.exercises.find((item) => item.id === exercise.id);
  const answer = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correct) {
      setCorrectCount((count) => count + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
  };

  const advance = () => {
    if (selected === null) return;
    if (index < total - 1) {
      setIndex((current) => current + 1);
      setSelected(null);
      return;
    }
    const xp = Math.round((exerciseMeta?.xp ?? total * 10) * (correctCount / total));
    const pct = Math.round((correctCount / total) * 100);
    const newRecord = pct > (completed[exercise.id]?.bestPct ?? 0);
    recordResult(exercise.id, correctCount, total, xp);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    nav.replace("Result", { catSlug: params.catSlug, exId: params.exId, correct: correctCount, total, xp, newRecord });
  };

  const confirmExit = () => Alert.alert("Thoát bài luyện?", "Tiến độ câu trả lời hiện tại sẽ không được lưu.", [
    { text: "Tiếp tục làm", style: "cancel" },
    { text: "Thoát", style: "destructive", onPress: () => nav.goBack() },
  ]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.topbar}>
        <Pressable onPress={confirmExit} hitSlop={12} accessibilityLabel="Thoát bài luyện">
          <Ionicons name="close" size={25} color={colors.text} />
        </Pressable>
        <View style={styles.progressWrap}>
          <ProgressBar value={index / total} color={colors.primary} height={8} />
        </View>
        <Text style={styles.counter}>{index + 1}/{total}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.exerciseTitle}>{exercise.title}</Text>
        {question.code ? <Text selectable style={styles.code}>{question.code}</Text> : null}
        <Text style={styles.question}>{question.q}</Text>
        <View style={styles.options}>
          {question.options.map((option, optionIndex) => {
            const isCorrect = selected !== null && optionIndex === question.correct;
            const isWrong = selected === optionIndex && optionIndex !== question.correct;
            return (
              <Pressable
                key={`${optionIndex}-${option}`}
                onPress={() => answer(optionIndex)}
                disabled={selected !== null}
                style={[styles.option, isCorrect && styles.correctOption, isWrong && styles.wrongOption]}
              >
                <Text style={[styles.optionLetter, isCorrect && styles.correctLetter, isWrong && styles.wrongLetter]}>{String.fromCharCode(65 + optionIndex)}</Text>
                <Text style={styles.optionText}>{option}</Text>
                {isCorrect ? <Ionicons name="checkmark-circle" size={21} color={colors.green} /> : null}
                {isWrong ? <Ionicons name="close-circle" size={21} color={colors.red} /> : null}
              </Pressable>
            );
          })}
        </View>
        {selected !== null ? (
          <View style={styles.explanation}>
            <Text style={[styles.feedback, selected === question.correct ? styles.feedbackCorrect : styles.feedbackWrong]}>
              {selected === question.correct ? "Chính xác" : "Chưa đúng"}
            </Text>
            {question.explanation ? <Text style={styles.explanationText}>{question.explanation}</Text> : null}
          </View>
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        <Pressable disabled={selected === null} onPress={advance} style={[styles.primaryButton, selected === null && styles.disabled]}>
          <Text style={styles.primaryText}>{index === total - 1 ? "Hoàn thành" : "Tiếp theo"}</Text>
          <Ionicons name={index === total - 1 ? "checkmark" : "arrow-forward"} size={18} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topbar: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, paddingVertical: 12 },
  progressWrap: { flex: 1 },
  counter: { color: colors.textMuted, fontSize: font.small, fontWeight: "700", minWidth: 36, textAlign: "right" },
  content: { padding: 20, paddingBottom: 28 },
  exerciseTitle: { color: colors.textMuted, fontSize: font.small, fontWeight: "700", marginBottom: 18 },
  code: { color: "#D9D4F5", backgroundColor: colors.bgDeep, borderColor: colors.border, borderWidth: 1, borderRadius: radius.sm, padding: 14, marginBottom: 18, fontFamily: "monospace", fontSize: font.small, lineHeight: 21 },
  question: { color: colors.text, fontSize: font.h2, fontWeight: "800", lineHeight: 31, marginBottom: 22 },
  options: { gap: 10 },
  option: { minHeight: 60, flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  optionLetter: { color: colors.textMuted, backgroundColor: colors.elevated, width: 32, height: 32, textAlign: "center", textAlignVertical: "center", borderRadius: 16, fontWeight: "800", overflow: "hidden" },
  optionText: { flex: 1, color: colors.text, fontSize: font.small, lineHeight: 21 },
  correctOption: { borderColor: colors.green, backgroundColor: colors.greenSoft },
  wrongOption: { borderColor: colors.red, backgroundColor: colors.redSoft },
  correctLetter: { color: colors.green, backgroundColor: "rgba(52,211,153,0.18)" },
  wrongLetter: { color: colors.red, backgroundColor: "rgba(251,113,133,0.18)" },
  explanation: { marginTop: 18, backgroundColor: colors.cardAlt, borderRadius: radius.md, padding: 15 },
  feedback: { fontSize: font.body, fontWeight: "800", marginBottom: 6 },
  feedbackCorrect: { color: colors.green },
  feedbackWrong: { color: colors.red },
  explanationText: { color: colors.textMuted, fontSize: font.small, lineHeight: 21 },
  footer: { paddingHorizontal: 20, paddingVertical: 12, borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
  primaryButton: { height: 52, backgroundColor: colors.primary, borderRadius: radius.md, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: font.body },
  disabled: { opacity: 0.45 },
  error: { color: colors.text, fontSize: font.body, textAlign: "center", margin: 24 },
});