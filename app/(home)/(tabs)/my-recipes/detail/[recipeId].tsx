// React and Expo imports
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

// Components imports
import RecipeHeader from '@/components/recipeDetails/RecipeHeader';
import QuickInfoBar from '@/components/recipeDetails/QuickInfoBar';
import TagsDisplay from '@/components/recipeDetails/TagsDisplay';
import NutritionInfo from '@/components/recipeDetails/NutritionInfo';
import InstructionList from '@/components/recipeDetails/InstructionList';
import IngredientList from '@/components/recipeDetails/IngredientList';
import PaddingView from '@/components/views/PaddingView';
import PrimaryButton from '@/components/buttons/PrimaryButton';

// Hooks imports
import { useRecipe } from '@/hooks/useRecipe';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { AlertCircle, Pencil, Trash2 } from 'lucide-react-native';
import RecipePageStatus from '@/components/recipeDetails/RecipePageStatus';
import Toast from 'react-native-toast-message';
import { useMyRecipes } from '@/hooks/useMyRecipes';



const MyRecipeDetailScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { recipeId } = useLocalSearchParams();
  const id = Number(recipeId);
  const { deleteRecipe } = useMyRecipes();
  const { recipe, loading, error, refetch } = useRecipe(id);
  
  const isRecipeIncomplete = recipe && (!recipe.ingredients?.length || !recipe.analyzed_instructions?.length);
  const totalTime = recipe
    ? recipe.ready_min || (recipe.preparation_min ?? 0) + (recipe.cooking_min ?? 0)
    : 0;
  const calories = recipe?.calories ? Math.round(recipe.calories) : null;


  const handleEditRecipe = () => {
    if (!recipeId) return;
    router.push(`/my-recipes/edit/${recipeId}`);
  };

  const handleDeleteRecipe = () => {
    if (!recipeId) return;

    Alert.alert(
      t('myRecipes.delete.confirmTitle'),
      t('myRecipes.delete.confirmMessage', { title: recipe?.title }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            const { success, error } = await deleteRecipe(id, false);

            if (success) {
              Toast.show({ type: 'success', text1: t('myRecipes.delete.success') });
              router.replace('/my-recipes');
            } else if (error?.code === "RECIPE_LINKED_TO_MEAL_PLAN") {
              Alert.alert(
                t('myRecipes.delete.forceTitle'),
                t('myRecipes.delete.forceMessage', { title: recipe?.title }),
                [
                  { text: t('cancel'), style: 'cancel' },
                  {
                    text: t('deleteAnyway'),
                    style: 'destructive',
                    onPress: async () => {
                      const { success: forceSuccess, error: forceError } = await deleteRecipe(id, true);
                      if (forceSuccess) {
                        Toast.show({ type: 'success', text1: t('myRecipes.delete.success') });
                        router.replace('/my-recipes');
                      } else {
                        Toast.show({ type: 'error', text1: t('error'), text2: forceError?.message });
                      }
                    },
                  },
                ]
              );
            } else {
              Toast.show({ type: 'error', text1: t('error'), text2: error?.message });
            }
          },
        },
      ]
    );
  };

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
    <>
      <Stack.Screen options={{
        headerTitle: recipe.title,
        headerRight: () => (
          <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity onPress={handleEditRecipe}>
            <Pencil size={22} color={Colors.colors.primary[100]} style={{ marginHorizontal: 16 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteRecipe} >
            <Trash2 size={22} color={Colors.colors.error[100]} />
          </TouchableOpacity>
        </View>
        ) }} 
      />
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
            diets={recipe.diets}
          />

          <IngredientList ingredients={recipe.ingredients} />
          <InstructionList instructions={recipe.analyzed_instructions} />
          {/* <EquipmentGrid instructions={recipe.analyzed_instructions} /> */}
          <NutritionInfo
            nutrients={recipe.nutrients}
            calories={calories}
          />

          {isRecipeIncomplete && (
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaText}>{t("recipes.notDetailed")}</Text>
            <PrimaryButton
              title={t("completeRecipe")}
              onPress={handleEditRecipe}
              style={{ marginBottom: 0}}
              leftIcon={<Pencil size={20} color={Colors.colors.neutral[100]} />}
            />
          </View>
        )}

        </PaddingView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.neutral[100],
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  messageText: {
    marginTop: 10,
    color: "#333",
  },
  errorTitle: {
    marginTop: 16,
    textAlign: 'center',
    ...globalStyles.headlineSmall,
    color: Colors.colors.gray[900],
  },
  errorMessage: {
    marginVertical: 8,
    textAlign: 'center',
    ...globalStyles.largeBody,
    color: Colors.colors.gray[500],
    lineHeight: 22,
  },
  scrollContentContainer: {
    paddingBottom: 120,
  },
  ctaContainer: {
    backgroundColor: Colors.colors.primary[600],
    borderRadius: 16, 
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.colors.primary[200],
  },
  ctaText: {
    ...globalStyles.largeBodyMedium,
    fontSize: 17,
    color: Colors.colors.gray[500],            
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default MyRecipeDetailScreen;