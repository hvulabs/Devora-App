import { ThemeColors, darkColors, lightColors } from "./theme";

import { useColorScheme } from "react-native";
import { useProgress } from "./store/progress";

export function useAppTheme(): { colors: ThemeColors; isDark: boolean } {
  const { themeMode } = useProgress();
  const systemScheme = useColorScheme();
  const isDark = themeMode === "system" ? systemScheme !== "light" : themeMode === "dark";
  return { colors: isDark ? darkColors : lightColors, isDark };
}
