import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {

  const { user } = useAuth();
  const router = useRouter();

  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.colors.neutral[100] },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verifyEmail" />
      <Stack.Screen name="sendPasswordResetCode" />
      <Stack.Screen name="verifyPasswordReset" />
      <Stack.Screen name="resetPassword" />
      <Stack.Screen name="complete-register/basicInfo" />
      <Stack.Screen name="complete-register/selectActivity" />
      <Stack.Screen name="complete-register/selectGoal" />
      <Stack.Screen name="complete-register/selectDiet" />
      <Stack.Screen name="complete-register/selectIntolerance" />
      <Stack.Screen name="complete-register/selectCuisine" />
    </Stack>
  );
}
