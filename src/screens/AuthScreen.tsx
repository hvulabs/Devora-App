import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Mascot } from "../components/Mascot";
import { colors, radius, font } from "../theme";
import { useProgress } from "../store/progress";

type Nav = NativeStackNavigationProp<RootStackParamList, "Auth">;

export default function AuthScreen() {
  const nav = useNavigation<Nav>();
  const { signIn } = useProgress();

  const handleSignIn = (provider: string) => {
    signIn(provider);
    nav.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Mascot size={230} />
          <Text style={styles.brand}>Devora</Text>
          <Text style={styles.title}>Nói tiếng Anh IT{"\n"}như viết code.</Text>
          <Text style={styles.subtitle}>
            Kể Pol nghe bạn muốn giỏi mảng nào và nhận bài luyện ngắn 5 phút
            dành riêng cho bạn.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnApple,
              pressed && styles.pressed,
            ]}
            onPress={() => handleSignIn("apple")}
          >
            <Ionicons name="logo-apple" size={22} color="#000" />
            <Text style={styles.btnAppleText}>Tiếp tục với Apple</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnGoogle,
              pressed && styles.pressed,
            ]}
            onPress={() => handleSignIn("google")}
          >
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text style={styles.btnGoogleText}>Tiếp tục với Google</Text>
          </Pressable>

          <Pressable onPress={() => handleSignIn("guest")} style={styles.guest}>
            <Text style={styles.guestText}>Dùng thử không cần đăng nhập</Text>
          </Pressable>

          <Text style={styles.terms}>
            Nội dung học được xây từ standup, code review và incident call thực
            tế. Khi tiếp tục, bạn đồng ý với{" "}
            <Text style={styles.link} onPress={() => Linking.openURL("https://coderslingo.com")}>
              Điều khoản
            </Text>{" "}
            và{" "}
            <Text style={styles.link} onPress={() => Linking.openURL("https://coderslingo.com")}>
              Chính sách quyền riêng tư
            </Text>{" "}
            của Devora.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  hero: { flex: 1, alignItems: "center", justifyContent: "center" },
  brand: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: font.body,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  title: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 34,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 40,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: font.body,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
    paddingHorizontal: 6,
  },
  actions: { paddingBottom: 8 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
    borderRadius: radius.pill,
    marginBottom: 14,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  btnApple: { backgroundColor: "#F4F2FA" },
  btnAppleText: { color: "#000", fontWeight: "700", fontSize: font.body },
  btnGoogle: { backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
  btnGoogleText: { color: "#fff", fontWeight: "700", fontSize: font.body },
  guest: { alignItems: "center", paddingVertical: 10 },
  guestText: { color: colors.textMuted, fontWeight: "600", fontSize: font.small },
  terms: {
    color: colors.textFaint,
    fontSize: font.tiny,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 10,
  },
  link: { color: colors.primary, textDecorationLine: "underline" },
});
