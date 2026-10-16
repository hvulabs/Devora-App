import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { ProgressProvider } from "./src/store/progress";
import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppTheme } from "./src/theme-context";

function AppContent() {
  const { colors, isDark } = useAppTheme();
  const navTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      background: colors.bg,
      card: colors.bg,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
      notification: colors.primary,
    },
  };
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return <SafeAreaProvider><ProgressProvider><AppContent /></ProgressProvider></SafeAreaProvider>;
}
