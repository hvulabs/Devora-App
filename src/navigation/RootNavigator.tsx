import AuthScreen from "../screens/AuthScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ExerciseScreen from "../screens/ExerciseScreen";
import React from "react";
import ResultScreen from "../screens/ResultScreen";
import { RootStackParamList } from "./types";
import SettingsScreen from "../screens/SettingsScreen";
import SplashScreen from "../screens/SplashScreen";
import Tabs from "./Tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../theme-context";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { colors } = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: "fade",
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ animation: "fade", gestureEnabled: false }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ animation: "fade" }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: "slide_from_right" }} />
    </Stack.Navigator>
  );
}
