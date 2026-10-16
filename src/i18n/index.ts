import * as Localization from "expo-localization";

import { I18n } from "i18n-js";
import en from "./en.json";
import { useProgress } from "../store/progress";
import vi from "./vi.json";

const i18n = new I18n({ en, vi });
i18n.enableFallback = true;

export function useT() {
  const { language } = useProgress();
  const systemLanguage = Localization.getLocales()[0]?.languageCode === "vi" ? "vi" : "en";
  i18n.locale = !language || language === "system" ? systemLanguage : language;
  return (key: string, options?: Record<string, string | number>) => i18n.t(key, options);
}
