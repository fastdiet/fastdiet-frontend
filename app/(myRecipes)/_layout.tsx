import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

export default function MyRecipesLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerBackTitle: t('back'),
        headerTitleStyle: { ...globalStyles.titleMedium, color: Colors.colors.gray[700] },
      }}
    >
      <Stack.Screen
        name="createRecipe"
        options={{
          title: t('recipes.create.title'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen
        name="edit-recipe"
        options={{
          title: t('recipes.edit.title'),
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          },
        }}
      />
    </Stack>
  );
}