// React and Expo imports
import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

// Components imports
import PaddingView from '@/components/views/PaddingView';
import TitleParagraph from '@/components/text/TitleParagraph';
import PrimaryButton from '@/components/buttons/PrimaryButton'; // O un componente de botón flotante
import MyRecipeCard from '@/components/recipe/MyRecipeCard';

// Hooks imports
import { useMyRecipes } from '@/hooks/useMyRecipes';

// Styles imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';



const MyRecipesScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { myRecipes, loading, deleteRecipe } = useMyRecipes(); // Hook para gestionar las recetas del usuario

  const handleAddNewRecipe = () => {
    router.push('/(home)/(tabs)/my-recipes/create');
  };
  
  const handleEditRecipe = (recipeId: string) => {
    router.push({
      pathname: '/(home)/(tabs)/my-recipes/edit/[recipeId]',
      params: { recipeId },
    });
  };

  const handleDeleteRecipe = (recipeId: string) => {
    // Aquí iría la lógica de confirmación (Alert) y luego la llamada a deleteRecipe
    console.log("Eliminar receta", recipeId)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PaddingView>
          <TitleParagraph
            title={t('myRecipes.title')}
            paragraph={t('myRecipes.subtitle')}
            containerStyle={{ marginTop: 16, marginBottom: 24 }}
          />

          {myRecipes.length > 0 ? (
            <View style={styles.recipesList}>
              {myRecipes.map((recipe) => (
                <MyRecipeCard 
                  key={recipe.id}
                  recipe={recipe}
                  onEdit={() => handleEditRecipe(recipe.id)}
                  onDelete={() => handleDeleteRecipe(recipe.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.noRecipesContainer}>
                <Ionicons name="receipt-outline" size={64} color={Colors.colors.gray[300]} />
                <Text style={styles.noRecipesTitle}>{t('myRecipes.noRecipes.title')}</Text>
                <Text style={styles.noRecipesText}>{t('myRecipes.noRecipes.subtitle')}</Text>
                <PrimaryButton 
                    title={t('myRecipes.cta.createFirst')}
                    onPress={handleAddNewRecipe}
                    style={{marginTop: 24}}
                />
            </View>
          )}

        </PaddingView>
      </ScrollView>

       {myRecipes.length > 0 && (
         <View style={styles.fabContainer}>
            <TouchableOpacity
                onPress={handleAddNewRecipe}
                style={styles.fab}
            >
                <Ionicons name="add" size={32} color={Colors.colors.neutral[100]} />
            </TouchableOpacity>
         </View>
       )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.gray[100],
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  recipesList: {
    gap: 16,
  },
  noRecipesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 48,
  },
  noRecipesTitle: {
      ...globalStyles.largeBodyBold,
      color: Colors.colors.gray[500],
      textAlign: 'center',
      marginTop: 16,
  },
  noRecipesText: {
    ...globalStyles.mediumBodyRegular,
    color: Colors.colors.gray[400],
    textAlign: 'center',
    marginTop: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80, // Ajustar por encima de la barra de pestañas
    right: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default MyRecipesScreen;