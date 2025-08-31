// React and Expo imports
import { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

// Components imports
import RecipeHeader from '@/components/recipeDetails/RecipeHeader';
import QuickInfoBar from '@/components/recipeDetails/QuickInfoBar';
import TagsDisplay from '@/components/recipeDetails/TagsDisplay';
import NutritionInfo from '@/components/recipeDetails/NutritionInfo';
import InstructionList from '@/components/recipeDetails/InstructionList';
import EquipmentGrid from '@/components/recipeDetails/EquipmentGrid';
import IngredientList from '@/components/recipeDetails/IngredientList';
import PaddingView from '@/components/views/PaddingView';

// Hooks imports
import { useTranslation } from 'react-i18next';
import { useRecipe } from '@/hooks/useRecipe';

// Style imports
import { Colors } from '@/constants/Colors';
import RecipePageStatus from '@/components/recipeDetails/RecipePageStatus';


const RecipeDetailScreen = () => {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ recipeId: string; day?: string; slot?: string, mealType?: string }>();
  const navigation = useNavigation();
  const recipeIdNumber = Number(params.recipeId);
  const { recipe, loading, error, refetch } = useRecipe(recipeIdNumber);

  useEffect(() => {
    let headerTitle = t("recipe.detailTitleFallback");
    if (params.day && params.mealType) {
      const dayIdx = parseInt(params.day, 10);
      const mealType = params.mealType;
      if (!isNaN(dayIdx) && mealType) {
        headerTitle = `${t(`constants.meals.${mealType}`)} - ${t(`constants.daysShort.${dayIdx}`)}`;
      }
    }
    navigation.setOptions({ title: headerTitle });
  }, [params.day, params.mealType, navigation, t, recipe]);

  const totalTime = recipe
    ? recipe.ready_min || (recipe.preparation_min ?? 0) + (recipe.cooking_min ?? 0)
    : 0;
  const calories = recipe?.calories ? Math.round(recipe.calories) : null;

  if (loading && !recipe) {
    return <RecipePageStatus status="loading" />;
  }

  if (error || !recipe) {
    return (
      <RecipePageStatus 
        status="error"
        errorDetails={{
          errorTitle: t("myRecipes.detail.notFound"),
          errorMessage: error,
          notFoundTitle: t("myRecipes.detail.notFoundTitle"),
          onRetry: refetch
        }}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <RecipeHeader
        imageUrl={recipe.image_url}
        title={recipe.title}
        summary={recipe.summary}
      />
      <PaddingView>
        <QuickInfoBar
          totalTime={totalTime}
          calories={calories}
          servings={recipe.servings}
        />
        <TagsDisplay
          cuisines={recipe.cuisines}
          dishTypes={recipe.dish_types}
          diets={recipe.diet_types}
        />
        
        <IngredientList ingredients={recipe.ingredients} />
        
        <InstructionList instructions={recipe.analyzed_instructions} />
        <EquipmentGrid instructions={recipe.analyzed_instructions} />
        <NutritionInfo
          nutrients={recipe.nutrients}
          calories={calories}
        />
      </PaddingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.neutral[100],
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
});

export default RecipeDetailScreen;