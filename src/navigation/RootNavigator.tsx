import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import SplashScreen from "../screens/SplashScreen";
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import BrowseScreen from "../screens/BrowseScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ExerciseScreen from "../screens/ExerciseScreen";
import ResultScreen from "../screens/ResultScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#15132A" },
        animation: "fade",
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ animation: "fade", gestureEnabled: false }}
      />
      <Stack.Screen
        name="Browse"
        component={BrowseScreen}
        options={{ animation: "slide_from_right" }}
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
    </Stack.Navigator>
  );
}
