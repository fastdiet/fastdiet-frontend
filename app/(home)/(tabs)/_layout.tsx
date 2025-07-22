// React & React Native Imports
import { Tabs } from "expo-router";

// Component Imports
import { HapticTab } from "@/components/HapticTab";

// Utility Imports
import { Colors } from "@/constants/Colors";

// Icon Imports
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { BookOpen, Home, UserCircle2 } from "lucide-react-native";

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
              <Home 
                size={28}
                color={focused ? Colors.colors.primary[200] : Colors.colors.gray[300]}
                strokeWidth={focused ? 2 : 1.7}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="my-recipes"
          options={({ route }) => {

            const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';

            const screensToHideTabBar = ['create', 'edit/[recipeId]'];
            
            return {
              title: "Mis recetas",
              tabBarIcon: ({ focused }) => (
               <BookOpen
                size={28}
                color={focused ? Colors.colors.primary[200] : Colors.colors.gray[300]}
                strokeWidth={focused ? 2 : 1.7}
              />
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
       
       
        <Tabs.Screen
          name="profile"
          options={({ route }) => {

            const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';

            const screensToHideTabBar = ['editGoal', 'editActivity', 'editDiet', 'editCuisines', 'editIntolerances', 'editPersonalData', 'changePassword'];
            
            return {
              title: "Perfil",
              tabBarIcon: ({ focused }) => (
                <UserCircle2
                  size={28}
                  color={focused ? Colors.colors.primary[200] : Colors.colors.gray[300]}
                  strokeWidth={focused ? 2 : 1.7}
                />
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