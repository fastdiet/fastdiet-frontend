import { useContext } from 'react';
import { MyRecipesContext } from '@/context/MyRecipesContext'; // Crearemos este archivo ahora

export const useMyRecipes = () => {
  const context = useContext(MyRecipesContext);
  if (context === undefined) {
    throw new Error('useMyRecipes must be used within a MyRecipesProvider');
  }
  return context;
};