import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function MyRecipesLayout() {
  const { t } = useTranslation();
  return (
    <Stack 
      screenOptions={{
        headerBackTitle: t('back'),
        contentStyle: { backgroundColor: Colors.colors.gray[100] },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="create"
        options={{ 
          headerTitle: t("myRecipes.createPageTitle"),
          headerBackTitle: t('back'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          }
        }} 
      />
      <Stack.Screen 
        name="detail/[recipeId]" 
      />
      <Stack.Screen 
        name="edit/[recipeId]" 
        options={{ 
          headerTitle: t("myRecipes.editPageTitle"),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          }
        }} 
      />
    </Stack>
  );
}