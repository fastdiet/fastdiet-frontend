import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function IndexLayout() {
  const { t } = useTranslation();
  return (
    <Stack 
      screenOptions={{ contentStyle: { backgroundColor: Colors.colors.gray[100] }}}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="[day]" 
        options={{ 
          headerBackTitle: t("back"),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          }
        }} 
      />
      <Stack.Screen 
          name="recipe/[recipeId]" 
        options={{ 
          headerBackTitle: t("back"),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          }
        }} 
      />
    </Stack>
  );
}