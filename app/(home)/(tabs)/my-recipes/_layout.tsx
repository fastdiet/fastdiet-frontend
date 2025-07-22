import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { Stack } from 'expo-router';

export default function MyRecipesLayout() {
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
        name="create"
        options={{ 
          headerTitle: 'Crear receta',
          headerBackTitle: 'Atrás',
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          }
        }} 
      />
      <Stack.Screen 
        name="detail/[recipeId]" 
        options={{ 
          headerBackTitle: 'Atrás',
        }} 
      />
      <Stack.Screen 
        name="edit/[recipeId]" 
        options={{ 
          headerTitle: 'Editar receta',
          headerBackTitle: 'Atrás',
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          }
        }} 
      />
    </Stack>
  );
}