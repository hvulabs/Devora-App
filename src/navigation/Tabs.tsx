import BrowseScreen from "../screens/BrowseScreen";
import HomeScreen from "../screens/HomeScreen";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";
import React from "react";
import type { TabParamList } from "./types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { font } from "../theme";
import { useAppTheme } from "../theme-context";

const Tab = createBottomTabNavigator<TabParamList>();
const icons = {
  Home: ["home", "home-outline"],
  Browse: ["compass", "compass-outline"],
  Profile: ["person-circle", "person-circle-outline"],
} as const;

export default function Tabs() {
  const { colors } = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.bgDeep, borderTopColor: colors.border, height: 62, paddingTop: 6, paddingBottom: 6 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: font.tiny, fontWeight: "700" },
        tabBarIcon: ({ color, focused, size }) => {
          const [active, inactive] = icons[route.name];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}