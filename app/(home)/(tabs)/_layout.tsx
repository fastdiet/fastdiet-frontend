// React & React Native Imports
import { Tabs } from "expo-router";
import { ViewStyle } from 'react-native'; 

// Component Imports
import { HapticTab } from "@/components/HapticTab";

// Utility Imports
import { Colors } from "@/constants/Colors";

// Icon Imports
import { getFocusedRouteNameFromRoute, Route } from "@react-navigation/native";
import { BookOpen, Home, ShoppingCart, UserCircle2 } from "lucide-react-native";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const isKeyboardVisible = useKeyboardVisible();
  const { t } = useTranslation();
  const getTabBarStyle = (route: Partial<Route<string>>): ViewStyle => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';
    
    const screensToHideTabBar: string[] = [
      'create', 'edit/[recipeId]',
      'editGoal', 'editActivity', 'editDiet', 'editCuisines', 'editIntolerances', 'editPersonalData', 'changePassword'
    ];
    const shouldHideForRoute = screensToHideTabBar.includes(routeName);

    if (shouldHideForRoute || isKeyboardVisible) {
      return { display: 'none' };
    }

    return {
      backgroundColor: Colors.colors.neutral[100],
      borderTopWidth: 0,
      position: 'absolute' as 'absolute',
      height: 68,
    };
  }

  return (
    <>
      <Tabs
         screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors.colors.primary[200],
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: getTabBarStyle(route),
        })}
      >
        <Tabs.Screen
          name="menu"
          options={{
            title: t("tabs.menu"),
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
          options={{
            title: t("tabs.myRecipes"),
            tabBarIcon: ({ focused }) => (
              <BookOpen
                size={28}
                color={focused ? Colors.colors.primary[200] : Colors.colors.gray[300]}
                strokeWidth={focused ? 2 : 1.7}
              />
            ),
          }}
        />

         <Tabs.Screen
          name="shopping-list/index"
          options={{
            title: t("tabs.shoppingList"),
            tabBarIcon: ({ focused }) => (
              <ShoppingCart
                size={28}
                color={focused ? Colors.colors.primary[200] : Colors.colors.gray[300]}
                strokeWidth={focused ? 2 : 1.7}
              />
            ),
          }}
        />
       
       
        <Tabs.Screen
          name="profile"
          options={{
            title: t("tabs.profile"),
            tabBarIcon: ({ focused }) => (
              <UserCircle2
                size={28}
                color={focused ? Colors.colors.primary[200] : Colors.colors.gray[300]}
                strokeWidth={focused ? 2 : 1.7}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}