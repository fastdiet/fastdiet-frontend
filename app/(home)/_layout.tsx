// React & React Native Imports
import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";


export default function HomeLayout() {

  const { user } = useAuth();
  if (!user) return <Redirect href="/login"/>

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
