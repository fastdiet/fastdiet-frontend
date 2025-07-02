import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { Stack } from 'expo-router';

export default function IndexLayout() {
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
          headerBackTitle: 'Atrás',
          headerTitleStyle: {
            ...globalStyles.title,
            fontSize: 20,
          }
        }} 
      />
      <Stack.Screen 
          name="recipe/[recipeId]" 
        options={{ 
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