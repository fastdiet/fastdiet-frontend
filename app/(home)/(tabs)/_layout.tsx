// React & React Native Imports
import { Tabs } from "expo-router";

// Component Imports
import { HapticTab } from "@/components/HapticTab";

// Utility Imports
import { Colors } from "@/constants/Colors";

// Icon Imports
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.colors.primary[200],
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: Colors.colors.neutral[100],
            borderTopWidth: 0,
            position: "absolute",
            height: 68
          },
        }}
      >
        <Tabs.Screen
          name="menu"
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
          options={({ route }) => {

            const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';

            const screensToHideTabBar = ['editGoal', 'editActivity', 'editDiet', 'editCuisines', 'editIntolerances', 'editPersonalData', 'changePassword'];
            
            return {
              title: "Perfil",
              tabBarIcon: ({ focused }) => (
                <FontAwesome name="user" size={35} strokeWidth={1} 
                color={ focused ? Colors.colors.primary[200] : Colors.colors.gray[300] } />
              ),
              tabBarStyle: {
                display: screensToHideTabBar.includes(routeName) ? 'none' : 'flex',
                backgroundColor: Colors.colors.neutral[100],
                borderTopWidth: 0,
                position: "absolute",
                height: 68,
              },
            };
          }}
        />
      </Tabs>
    </>
  );
}
