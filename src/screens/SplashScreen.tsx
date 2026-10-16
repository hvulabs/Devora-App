import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { colors, font } from "../theme";

import { Mascot } from "../components/Mascot";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useProgress } from "../store/progress";

type Nav = NativeStackNavigationProp<RootStackParamList, "Splash">;

const MIN_DURATION = 1700;

export default function SplashScreen() {
  const nav = useNavigation<Nav>();
  const { ready, signedIn } = useProgress();

  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;

  // gate: wait for both the min splash time AND the store to be ready
  const timePassed = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -10, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(bar, { toValue: 1, duration: MIN_DURATION, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }).start();

    const t = setTimeout(() => {
      timePassed.current = true;
      maybeGo();
    }, MIN_DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maybeGo = () => {
    if (!timePassed.current || !ready) return;
    nav.reset({ index: 0, routes: [{ name: signedIn ? "Tabs" : "Auth" }] });
  };

  useEffect(() => {
    maybeGo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const barWidth = bar.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={styles.root}>
      <Animated.View style={{ opacity, transform: [{ scale }, { translateY: float }] }}>
        <Mascot size={200} />
      </Animated.View>
      <Animated.Text style={[styles.brand, { opacity }]}>devora</Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity }]}>
        English for IT
      </Animated.Text>

      <View style={styles.barWrap}>
        <AnimatedBar value={barWidth} />
      </View>
    </View>
  );
}

function AnimatedBar({ value }: { value: Animated.AnimatedInterpolation<number> }) {
  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          { width: value.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  brand: { color: colors.text, fontSize: 34, fontWeight: "900", marginTop: 18, letterSpacing: 0.5 },
  tagline: { color: colors.primary, fontSize: font.body, fontWeight: "700", marginTop: 4 },
  barWrap: { position: "absolute", bottom: 72, width: 140 },
  track: {
    height: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  fill: { height: 6, borderRadius: 6, backgroundColor: colors.primary },
});
