// React and Expo imports
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import Toast from "react-native-toast-message";
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

// Hooks imports
import { useMenu } from "@/hooks/useMenu";
import { useState } from "react";
import ChangeRecipeModal from "./ChangeRecipeModal";
import { fetchRecipeSuggestions } from "@/services/recipeSuggestions";



interface DayMenuScreenProps {
  dayData: SlotMeal[] | undefined | null;
  dayIndex: number;
}

const DayMenuScreen: React.FC<DayMenuScreenProps> = ({ dayData, dayIndex }) => {
  const { t } = useTranslation();
  const { changeMealRecipe, deleteMeal } = useMenu();
  const router = useRouter();

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [activeChangeSlot, setActiveChangeSlot] = useState<SlotMeal | null>(null);

  const [suggestions, setSuggestions] = useState<RecipeShort[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);

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

  const handleChangeRecipeRequest = async (slotData: SlotMeal) => {
    if (!slotData.recipe || !slotData.meal_item_id) {
      Toast.show({ type: 'error', text1: t("errors.generic") });
      return;
    }

    setIsLoadingSuggestions(true);
    setActiveChangeSlot(slotData);
    setModalVisible(true);

    const { success, error, data } = await fetchRecipeSuggestions(slotData.meal_item_id);

    if (success && data) {
      setSuggestions(data);
    } else {
      Toast.show({ type: 'error', text1: error?.message || t("errors.generic") });
      setSuggestions([]);
    }
    
    setIsLoadingSuggestions(false);
  };

  const handleRecipeSelection = async (newRecipe: RecipeShort) => {
    if (activeChangeSlot) {
      await changeMealRecipe(dayIndex, activeChangeSlot.slot, newRecipe);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
   
    setTimeout(() => {
      setActiveChangeSlot(null);
      setSuggestions([]);
    }, 300);
  };

  const deleteRecipe = (recipe: RecipeShort, slot: number) => {
    Alert.alert(
      t('index.menu.deleteMeal.confirmTitle'),
      t('index.menu.deleteMeal.confirmMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            const { success, error } = await deleteMeal(dayIndex, slot);
            if (success) {
              Toast.show({ type: 'success', text1: t('index.menu.deleteMeal.success') });
            } else {
              Toast.show({ type: 'error', text1: t('error'), text2: error?.message ?? "" }, );
            }
          },
        },
      ]
    );
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <PaddingView>
          <View style={styles.mealCardsContainer}>
            {mealsConfig.map((meal) => {
              const slotData = dayData?.find(r => r.slot === meal.slot) || null;
              const recipe = slotData?.recipe || null;

              if (recipe && slotData) {
                return (
                  <MealCard
                    key={meal.key}
                    mealTypeKey={meal.key as "breakfast" | "lunch" | "dinner"}
                    mealTypeDisplay={meal.label}
                    recipe={recipe}
                    onPress={() => navigateToRecipeDetail(recipe, meal.slot)}
                    onChange={() => handleChangeRecipeRequest(slotData)}
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
      <ChangeRecipeModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        recipeToChange={activeChangeSlot?.recipe || null}
        onRecipeSelected={handleRecipeSelection}
        suggestions={suggestions}
        isLoading={isLoadingSuggestions}
      />
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
  // noMealCard: {
  //   borderRadius: 16,
  //   backgroundColor: Colors.colors.gray[200],
  //   padding: 20,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   minHeight: 100,
  //   borderWidth: 1,
  //   borderColor: Colors.colors.gray[200],
  //   borderStyle: 'dashed',
  // },
  // noMealText: {
  //   ...globalStyles.mediumBodySemiBold,
  //   color: Colors.colors.gray[500],
  // },
  noMealCard: {
    borderRadius: 16,
    backgroundColor: Colors.colors.neutral[100], 
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: 1.5,
    borderColor: Colors.colors.gray[200],
    borderStyle: 'dashed',
  },
  noMealText: {
    ...globalStyles.largeBody,
    color: Colors.colors.gray[400],
    textAlign: 'center',
  },
});

export default DayMenuScreen;