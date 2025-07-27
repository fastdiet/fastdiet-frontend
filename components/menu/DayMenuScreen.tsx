// React and Expo imports
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useMemo, useState } from "react";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

// Components imports
import PaddingView from "@/components/views/PaddingView";
import MealCard from "@/components/menu/MealCard";
import ChangeRecipeModal from "@/components/menu/changeRecipe/ChangeRecipeModal";

// Style imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";

// Models imports
import { RecipeShort, SlotMeal } from "@/models/mealPlan";

// Hooks imports
import { useMenu } from "@/hooks/useMenu";
import { fetchRecipeSuggestions } from "@/services/recipeSuggestions";
import { PlusCircle } from "lucide-react-native";



interface DayMenuScreenProps {
  dayIndex: number;
}

const DayMenuScreen: React.FC<DayMenuScreenProps> = ({ dayIndex }) => {
  const { t } = useTranslation();
  const { menu, updateMealRecipe, addMealRecipe, deleteMeal } = useMenu();
  const router = useRouter();

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [activeChangeSlot, setActiveChangeSlot] = useState<SlotMeal | null>(null);

  const [suggestions, setSuggestions] = useState<RecipeShort[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);

  const mealsConfig = useMemo(() => [
    { key: "breakfast", slot: 0, label: t("constants.meals.breakfast"), noMealText: t("index.menu.day.noBreakfastPlanned") },
    { key: "lunch", slot: 1, label: t("constants.meals.lunch"), noMealText: t("index.menu.day.noLunchPlanned") },
    { key: "dinner", slot: 2, label: t("constants.meals.dinner"), noMealText: t("index.menu.day.noDinnerPlanned") },
  ], [t]);

  const dayData = useMemo(() => {
    return menu?.days.find(day => day.day === dayIndex)?.meals || null;
  }, [menu, dayIndex]);


  const navigateToRecipeDetail = (recipe: RecipeShort, slot: number) => {
    if (recipe && recipe.id) {
      router.push({
        pathname: "/(home)/(tabs)/menu/recipe/[recipeId]",
        params: { recipeId: recipe.id.toString(), day: dayIndex.toString(), slot: slot.toString() }
      });
    }
  };

  const handleAddRecipeRequest = (mealKey: string, slot: number) => {
    const mockSlotData: SlotMeal = {
      slot: slot,
      meal_item_id: 0,
      recipe: null,
    };

    handleChangeRecipeRequest(mockSlotData, mealKey, slot);
  };

  const handleChangeRecipeRequest = async (slotData: SlotMeal, mealKey?: string, slot?: number) => {

    setIsLoadingSuggestions(true);
    setActiveChangeSlot(slotData);
    setModalVisible(true);

    let apiResponse;
    if (slotData.recipe && slotData.meal_item_id) {
      apiResponse = await fetchRecipeSuggestions({ meal_item_id: slotData.meal_item_id });
    } else {
      apiResponse= await fetchRecipeSuggestions({ dayIndex: dayIndex, slot: slot });
    }

    const { success, error, data } = apiResponse;

    if (success && data) {
      setSuggestions(data);
    } else {
      Toast.show({ type: 'error', text1: error?.message || t("errors.generic") });
      setSuggestions([]);
    }
    
    setIsLoadingSuggestions(false);
  };

  const handleRecipeSelection = async (newRecipe : RecipeShort) => {
    if (!activeChangeSlot) return;

    let apiResponse;
    if (activeChangeSlot.recipe && activeChangeSlot.meal_item_id) {
      apiResponse = await updateMealRecipe(dayIndex, activeChangeSlot, newRecipe);
    } else {
      apiResponse = await addMealRecipe(dayIndex, activeChangeSlot.slot, newRecipe);
    }

    if (apiResponse.success) {
      Toast.show({ type: 'success', text1: t('index.menu.changeMeal.success') });
    } else {
      Toast.show({
        type: 'error',
        text1: t('errors.generic'),
        text2: apiResponse.error?.message || '',
      });
    }
    closeModal()
  };


  const closeModal = () => {
    setModalVisible(false);
    setActiveChangeSlot(null);
    setSuggestions([]);
  };

  const deleteRecipe = (slotMeal: SlotMeal) => {
    Alert.alert(
      t('index.menu.deleteMeal.confirmTitle'),
      t('index.menu.deleteMeal.confirmMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            const { success, error } = await deleteMeal(slotMeal.meal_item_id);
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

              return (recipe && slotData) ?
                (
                  <MealCard
                    key={meal.key}
                    mealTypeKey={meal.key as "breakfast" | "lunch" | "dinner"}
                    mealTypeDisplay={meal.label}
                    recipe={recipe}
                    onPress={() => navigateToRecipeDetail(recipe, meal.slot)}
                    onChange={() => handleChangeRecipeRequest(slotData)}
                    onDelete={() => deleteRecipe(slotData)}
                  />
                )
              : (
                  <TouchableOpacity 
                    key={meal.key} 
                    style={styles.noMealCard}
                    onPress={() => handleAddRecipeRequest(meal.key, meal.slot)}
                    activeOpacity={0.7}
                  >
                    <PlusCircle size={32} color={Colors.colors.gray[400]} strokeWidth={1.5} />
                    <Text style={styles.noMealText}>{meal.noMealText}</Text>
                  </TouchableOpacity>
                );
              }
            )}
            
          </View>
        </PaddingView>
      </ScrollView>
      {activeChangeSlot && (
        <ChangeRecipeModal
          isVisible={isModalVisible}
          onClose={closeModal}
          activeChangeSlot={activeChangeSlot} 
          onRecipeSelected={handleRecipeSelection}
          suggestions={suggestions}
          isLoading={isLoadingSuggestions}
        />
      )}
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
    backgroundColor: Colors.colors.neutral[100],
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: 1.5,
    borderColor: Colors.colors.gray[200],
    borderStyle: 'dashed',
    gap: 12
  },
  noMealText: {
    ...globalStyles.largeBody,
    color: Colors.colors.gray[500],
    textAlign: "center"
  },
});

export default DayMenuScreen;