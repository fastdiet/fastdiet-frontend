// React & React Native Imports
import { Colors } from "@/constants/Colors";
import { MenuProvider } from "@/context/MenuContext";
import { MyRecipesProvider } from "@/context/MyRecipesContext";
import { useAuth } from "@/hooks/useAuth";
import { Redirect, SplashScreen,Stack, useRouter } from "expo-router";


export default function HomeLayout() {

  const { user, loading } = useAuth();
  if (loading) {
    SplashScreen.preventAutoHideAsync();
    return null;
  }
  const router = useRouter();
  if (!user) return <Redirect href="/login"/>

  if (user && !user.username) {
    return <Redirect href="/complete-register/basicInfo" />;
  }

  return (
    <MyRecipesProvider>
      <MenuProvider>
        <Stack
          screenOptions={{
          contentStyle: { backgroundColor: Colors.colors.neutral[100] },
          animation: "slide_from_right",
        }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </MenuProvider>
    </MyRecipesProvider>
    
  );
}