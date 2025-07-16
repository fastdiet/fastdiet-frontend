import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerBackTitle: t('back'),
        contentStyle: { backgroundColor: Colors.colors.neutral[100] },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="editGoal"
        options={{
          title: t('profile.goal'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen
        name="editActivity"
        options={{
          title: t('profile.activityLevel'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          },
        }}
      />

      <Stack.Screen
        name="editDiet"
        options={{
          title: t('profile.diet'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          },
        }}
      />

      <Stack.Screen
        name="editCuisines"
        options={{
          title: t('profile.cuisinesTitle'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          },
        }}
      />

      <Stack.Screen
        name="editIntolerances"
        options={{
          title: t('profile.intolerances'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          },
        }}
      />

      <Stack.Screen
        name="editPersonalData"
        options={{
          title: t('profile.personalData'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          },
        }}
      />

      <Stack.Screen
        name="changePassword"
        options={{
          title: t('profile.password'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          },
        }}
      />

    </Stack>
  );
}