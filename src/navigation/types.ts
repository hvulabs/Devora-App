import type { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  Home: undefined;
  Browse: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Category: { slug: string };
  Exercise: { catSlug: string; exId: string };
  Result: {
    catSlug: string;
    exId: string;
    correct: number;
    total: number;
    xp: number;
    newRecord: boolean;
  };
  Settings: undefined;
};
