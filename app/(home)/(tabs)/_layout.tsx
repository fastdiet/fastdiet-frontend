// React & React Native Imports
import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";

// Component Imports
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";

// Utility Imports
import { Colors } from "@/constants/Colors";

// Icon Imports
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.colors.primary[200],
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title:"Menú",
            tabBarIcon: ({ focused }) => (
              <FontAwesome name="home" size={35}  strokeWidth={1}  color={
                  focused ? Colors.colors.primary[200] : Colors.colors.gray[300]
                } />
            ),
          }}
        />
       
       
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ focused }) => (
              <FontAwesome name="user" size={35} strokeWidth={1} 
              color={ focused ? Colors.colors.primary[200] : Colors.colors.gray[300] } />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
