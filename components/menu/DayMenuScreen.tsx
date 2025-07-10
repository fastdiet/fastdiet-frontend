// React and Expo imports
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

// Components imports
import PaddingView from "@/components/views/PaddingView";
import MealCard from "@/components/menu/MealCard";
// Style imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";

// Models imports
import { RecipeShort, SlotMeal } from "@/models/mealPlan";



interface DayMenuScreenProps {
  dayData: SlotMeal[] | undefined | null;
  dayIndex: number;
}

const DayMenuScreen = ({ dayData, dayIndex }: DayMenuScreenProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const mealsConfig = [
    { key: "breakfast", slot: 0, label: t("constants.meals.breakfast"), noMealText: t("index.menu.day.noBreakfastPlanned") },
    { key: "lunch", slot: 1, label: t("constants.meals.lunch"), noMealText: t("index.menu.day.noLunchPlanned") },
    { key: "dinner", slot: 2, label: t("constants.meals.dinner"), noMealText: t("index.menu.day.noDinnerPlanned") },
  ];

  const navigateToRecipeDetail = (recipe: RecipeShort, slot: number) => {
    if (recipe && recipe.id) {
      router.push({
        pathname: "/(home)/(tabs)/menu/recipe/[recipeId]",
        params: { recipeId: recipe.id.toString(), day: dayIndex.toString(), slot: slot.toString() }
      });
    }
  };

  const changeRecipe = (recipe: RecipeShort, slot: number) => {
    // TODO: Implement logic to swap the recipe in the meal plan
    console.log("Change recipe " + recipe.id)
  };

  const deleteRecipe = (recipe: RecipeShort, slot: number) => {
    // TODO: Implement logic to remove the recipe from the meal plan
    console.log("Delete recipe " + recipe.id)
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <PaddingView>
          <View style={styles.mealCardsContainer}>
            {mealsConfig.map((meal) => {
              const recipe = dayData?.find(r => r.slot === meal.slot)?.recipe || null;

              if (recipe) {
                return (
                  <MealCard
                    key={meal.key}
                    mealTypeKey={meal.key as "breakfast" | "lunch" | "dinner"}
                    mealTypeDisplay={meal.label}
                    recipe={recipe}
                    onPress={() => navigateToRecipeDetail(recipe, meal.slot)}
                    onChange={() => changeRecipe(recipe, meal.slot)}
                    onDelete={() => deleteRecipe(recipe, meal.slot)}
                  />
                );
              } else {
                return (
                  <View key={meal.key} style={styles.noMealCard}>
                    <Text style={styles.noMealText}>{meal.noMealText}</Text>
                  </View>
                );
              }
            })}
          </View>
        </PaddingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.gray[100],
  },
  scrollContentContainer: {
    paddingBottom: 120,
  },
  mealCardsContainer: {
    gap: 20,
  },
  noMealCard: {
    borderRadius: 16,
    backgroundColor: Colors.colors.gray[200],
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.colors.gray[200],
    borderStyle: 'dashed',
  },
  noMealText: {
    ...globalStyles.mediumBodySemiBold,
    color: Colors.colors.gray[500],
  },
});

export default DayMenuScreen;