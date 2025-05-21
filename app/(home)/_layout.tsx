// React & React Native Imports
import { Colors } from "@/constants/Colors";
import { MenuProvider } from "@/context/MenuContext";
import { useAuth } from "@/hooks/useAuth";
import { Redirect, Slot, Stack, useRouter } from "expo-router";


export default function HomeLayout() {

  const { user } = useAuth();
  const router = useRouter();
  if (!user) return <Redirect href="/login"/>

  
  return (
    <MenuProvider>
      <Stack
        screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.colors.neutral[100] },
        animation: "slide_from_right",
      }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </MenuProvider>
  );
}
