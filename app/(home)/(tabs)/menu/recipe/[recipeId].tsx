// React and Expo imports
import { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Components imports
import RecipeHeader from '@/components/recipeDetails/RecipeHeader';
import QuickInfoBar from '@/components/recipeDetails/QuickInfoBar';
import TagsDisplay from '@/components/recipeDetails/TagsDisplay';
import NutritionInfo from '@/components/recipeDetails/NutritionInfo';
import InstructionList from '@/components/recipeDetails/InstructionList';
import EquipmentGrid from '@/components/recipeDetails/EquipmentGrid';
import IngredientList from '@/components/recipeDetails/IngredientList';
import PaddingView from '@/components/views/PaddingView';
import PrimaryButton from '@/components/buttons/PrimaryButton';

// Hooks imports
import { useTranslation } from 'react-i18next';
import { useRecipe } from '@/hooks/useRecipe';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';


const getSlotName = (slotIndex: number, t: (key: string) => string): string => {
  const slotKeyMap: { [key: number]: string } = {
    0: "constants.meals.breakfast",
    1: "constants.meals.lunch",
    2: "constants.meals.dinner",
  };
  return t(slotKeyMap[slotIndex] || "constants.meals.meal");
};

const RecipeDetailScreen = () => {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ recipeId: string; day?: string; slot?: string }>();
  const navigation = useNavigation();

  const { recipe, loading, error, refetch } = useRecipe(params.recipeId);

  useEffect(() => {
    let headerTitle = t("recipe.detailTitleFallback");
    if (params.day && params.slot) {
      const dayIdx = parseInt(params.day, 10);
      const slotIdx = parseInt(params.slot, 10);
      if (!isNaN(dayIdx) && !isNaN(slotIdx)) {
        headerTitle = `${getSlotName(slotIdx, t)} - ${t(`constants.daysShort.${dayIdx}`)}`;
      }
    }
    navigation.setOptions({ title: headerTitle });
  }, [params.day, params.slot, navigation, t, recipe]);

  const calories = useMemo(() => recipe?.calories ? Math.round(recipe.calories) : null, [recipe?.calories]);
  const totalTime = useMemo(() => {
    if (!recipe) return 0;
    const prepTime = recipe.preparation_min || 0;
    const cookTime = recipe.cooking_min || 0;
    return recipe.ready_min || prepTime + cookTime;
  }, [recipe]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.colors.primary[100]} />
        <Text style={[globalStyles.mediumBodySemiBold, styles.messageText]}>{t("index.menu.recipe.loading")}</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.centeredContainer}>
        <Stack.Screen options={{ title: t("index.menu.recipe.notFoundTitle") }} />
        <MaterialCommunityIcons name="alert-circle-outline" size={56} color={Colors.colors.error[100]} />
        <Text style={styles.errorTitle}>{t("index.menu.recipe.notFound")}</Text>
        <Text style={styles.errorMessage}>{error || t("index.menu.recipe.couldNotLoad")}</Text>
        <PrimaryButton title={t("retry")} onPress={() => refetch()} style={{ marginTop: 24, paddingHorizontal: 32 }}/>
      </View>
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
          diets={recipe.diets}
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
    paddingBottom: 80,
  },
});

export default RecipeDetailScreen;