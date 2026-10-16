import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import { Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, font, radius } from "../theme";

import { Ionicons } from "@expo/vector-icons";
import { Mascot } from "../components/Mascot";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ResponseType } from "expo-auth-session";
import type { RootStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useProgress } from "../store/progress";

WebBrowser.maybeCompleteAuthSession();

type Nav = NativeStackNavigationProp<RootStackParamList, "Auth">;

export default function AuthScreen() {
  const nav = useNavigation<Nav>();
  const { signIn } = useProgress();
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [googleRequest, googleResponse, promptGoogle] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    responseType: ResponseType.IdToken,
    scopes: ["openid", "profile", "email"],
  });

  const completeSignIn = (provider: string, displayName?: string | null) => {
    signIn(provider, displayName);
    nav.reset({ index: 0, routes: [{ name: "Tabs" }] });
  };

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => setAppleAvailable(false));
  }, []);

  useEffect(() => {
    if (googleResponse?.type !== "success") return;
    if (!googleResponse.params.id_token) {
      Alert.alert("Không thể đăng nhập", "Google không trả về mã xác thực. Vui lòng thử lại.");
      return;
    }
    completeSignIn("google");
  }, [googleResponse]);

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      if (!credential.identityToken) {
        Alert.alert("Không thể đăng nhập", "Apple không trả về mã xác thực. Vui lòng thử lại.");
        return;
      }
      const name = [credential.fullName?.givenName, credential.fullName?.familyName].filter(Boolean).join(" ");
      completeSignIn("apple", name || null);
    } catch (error) {
      if ((error as { code?: string }).code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("Đăng nhập Apple thất bại", "Vui lòng thử lại sau.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleRequest) {
      Alert.alert("Chưa cấu hình Google Sign-In", "Thêm Google OAuth client ID vào các biến EXPO_PUBLIC_GOOGLE_* rồi khởi động lại app.");
      return;
    }
    try {
      await promptGoogle();
    } catch {
      Alert.alert("Đăng nhập Google thất bại", "Vui lòng thử lại sau.");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Mascot size={230} />
          <Text style={styles.brand}>Devora</Text>
          <Text style={styles.title}>Nói tiếng Anh IT{"\n"}như viết code.</Text>
          <Text style={styles.subtitle}>Kể Pol nghe bạn muốn giỏi mảng nào và nhận bài luyện ngắn 5 phút dành riêng cho bạn.</Text>
        </View>

        <View style={styles.actions}>
          {Platform.OS === "ios" && appleAvailable ? (
            <Pressable style={({ pressed }) => [styles.btn, styles.btnApple, pressed && styles.pressed]} onPress={handleAppleSignIn}>
              <Ionicons name="logo-apple" size={22} color="#000" />
              <Text style={styles.btnAppleText}>Tiếp tục với Apple</Text>
            </Pressable>
          ) : null}
          <Pressable style={({ pressed }) => [styles.btn, styles.btnGoogle, pressed && styles.pressed]} onPress={handleGoogleSignIn}>
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text style={styles.btnGoogleText}>Tiếp tục với Google</Text>
          </Pressable>
          <Pressable onPress={() => completeSignIn("guest")} style={styles.guest}>
            <Text style={styles.guestText}>Dùng thử không cần đăng nhập</Text>
          </Pressable>
          <Text style={styles.terms}>
            Nội dung học được xây từ standup, code review và incident call thực tế. Khi tiếp tục, bạn đồng ý với{" "}
            <Text style={styles.link} onPress={() => Linking.openURL("https://coderslingo.com")}>Điều khoản</Text>{" "}và{" "}
            <Text style={styles.link} onPress={() => Linking.openURL("https://coderslingo.com")}>Chính sách quyền riêng tư</Text> của Devora.
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
  brand: { color: colors.primary, fontWeight: "800", fontSize: font.body, marginTop: 4 },
  title: { color: colors.text, fontWeight: "900", fontSize: 34, textAlign: "center", marginTop: 10, lineHeight: 40 },
  subtitle: { color: colors.textMuted, fontSize: font.body, textAlign: "center", marginTop: 16, lineHeight: 24, paddingHorizontal: 6 },
  actions: { paddingBottom: 8 },
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 58, borderRadius: radius.pill, marginBottom: 14 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  btnApple: { backgroundColor: "#F4F2FA" },
  btnAppleText: { color: "#000", fontWeight: "700", fontSize: font.body },
  btnGoogle: { backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
  btnGoogleText: { color: "#fff", fontWeight: "700", fontSize: font.body },
  guest: { alignItems: "center", paddingVertical: 10 },
  guestText: { color: colors.textMuted, fontWeight: "600", fontSize: font.small },
  terms: { color: colors.textFaint, fontSize: font.tiny, textAlign: "center", lineHeight: 18, marginTop: 10 },
  link: { color: colors.primary, textDecorationLine: "underline" },
});