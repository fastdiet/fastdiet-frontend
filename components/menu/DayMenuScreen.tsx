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
import AddExtraMealTypeModal from "./AddExtraMealTypeModal";



interface DayMenuScreenProps {
  dayIndex: number;
}

const DayMenuScreen: React.FC<DayMenuScreenProps> = ({ dayIndex }) => {
  const { t } = useTranslation();
  const { menu, updateMealRecipe, addMealRecipe, deleteMeal } = useMenu();
  const router = useRouter();

  const [isChangeModalVisible, setChangeModalVisible] = useState<boolean>(false);
  const [activeChangeSlot, setActiveChangeSlot] = useState<SlotMeal | null>(null);
  const [isExtraTypeModalVisible, setExtraTypeModalVisible] = useState<boolean>(false);

  const [suggestions, setSuggestions] = useState<RecipeShort[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
   const [modalMode, setModalMode] = useState<'add' | 'change'>('change');


  const dayData = useMemo(() => {
    return menu?.days.find(day => day.day === dayIndex)?.meals.sort((a, b) => a.slot - b.slot) || null;
  }, [menu, dayIndex]);


  const navigateToRecipeDetail = (recipe: RecipeShort, slot: number, mealType: string) => {
    if (recipe && recipe.id) {
      router.push({
        pathname: "/(home)/(tabs)/menu/recipe/[recipeId]",
        params: { recipeId: recipe.id.toString(), day: dayIndex.toString(), slot: slot.toString(), mealType: mealType }
      });
    }
  };

  const handleChangeRecipeRequest = async (slotData: SlotMeal) => {

    const isAdding = !slotData.recipe;
    setModalMode(isAdding ? 'add' : 'change');
    setIsLoadingSuggestions(true);
    setActiveChangeSlot(slotData);
    setChangeModalVisible(true);

    const params = slotData.recipe && slotData.meal_item_id
      ? { meal_item_id: slotData.meal_item_id }
      : { dayIndex: dayIndex, slot: slotData.slot, mealType: slotData.meal_type };

    const { success, error, data } = await fetchRecipeSuggestions(params);

    if (success && data) {
      setSuggestions(data);
      setIsLoadingSuggestions(false);
    } else {
      setChangeModalVisible(false);
      Toast.show({ type: 'error', text1: t("error"), text2: error?.message });
      setIsLoadingSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleRecipeSelection = async (newRecipe : RecipeShort) => {
    if (!activeChangeSlot) return;

    const apiResponse = activeChangeSlot.meal_item_id
      ? await updateMealRecipe(dayIndex, activeChangeSlot, newRecipe)
      : await addMealRecipe(dayIndex, activeChangeSlot.slot, activeChangeSlot.meal_type, newRecipe);

    if (apiResponse.success) {
      Toast.show({ type: 'success', text1: t('index.menu.changeMeal.success') });
    } else {
      Toast.show({
        type: 'error',
        text1: t('errors.generic'),
        text2: apiResponse.error?.message || '',
      });
    }
    closeChangeModal()
  };

  const handleExtraMealTypeSelected = async (mealType: string) => {
    setExtraTypeModalVisible(false);

    const nextSlot = dayData && dayData.length > 0
      ? Math.max(...dayData.map(m => m.slot)) + 1
      : 3;

    const mockSlotData: SlotMeal = {
      slot: nextSlot,
      meal_item_id: null,
      recipe: null,
      meal_type: mealType
    };
    
    await handleChangeRecipeRequest(mockSlotData);
  };


  const closeChangeModal = () => {
    setChangeModalVisible(false);
    setActiveChangeSlot(null);
    setSuggestions([]);
    setIsLoadingSuggestions(false);
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
            const { success, error } = await deleteMeal(slotMeal.meal_item_id!);
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

  const getEmptyMealTextKey = (mealType: string): string => {
    const keyMap: { [key: string]: string } = {
      'breakfast': 'index.menu.day.noBreakfastPlanned',
      'lunch': 'index.menu.day.noLunchPlanned',
      'dinner': 'index.menu.day.noDinnerPlanned',
    };
    return keyMap[mealType] || 'index.menu.day.addExtraMeal';
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <PaddingView>
          <View style={styles.mealCardsContainer}>
            {dayData?.map((meal) => (
              meal.recipe ? (
                <MealCard
                  key={`meal_item_${meal.meal_item_id}`}
                  mealType={meal.meal_type}
                  mealTypeDisplay={t(`constants.meals.${meal.meal_type}`)}
                  recipe={meal.recipe}
                  onPress={() => navigateToRecipeDetail(meal.recipe!, meal.slot, meal.meal_type)}
                  onChange={() => handleChangeRecipeRequest(meal)}
                  onDelete={() => deleteRecipe(meal)}
                />
              ) : (
                <TouchableOpacity 
                  key={`empty_slot_${meal.slot}`}
                  style={styles.noMealCard}
                  onPress={() => handleChangeRecipeRequest(meal)}
                  activeOpacity={0.7}
                >
                  <PlusCircle size={32} color={Colors.colors.gray[400]} strokeWidth={1.5} />
                  <Text style={styles.noMealText}>{t(getEmptyMealTextKey(meal.meal_type))}</Text>
                </TouchableOpacity>
              )
            ))}

            <TouchableOpacity 
              style={styles.noMealCard}
              onPress={() => setExtraTypeModalVisible(true)}
              activeOpacity={0.7}
            >
              <PlusCircle size={32} color={Colors.colors.gray[400]} strokeWidth={1.5} />
              <Text style={styles.noMealText}>{t("index.menu.day.addExtraMeal")}</Text>
            </TouchableOpacity>
            
          </View>
        </PaddingView>
      </ScrollView>
      {activeChangeSlot && (
        <ChangeRecipeModal
          isVisible={isChangeModalVisible}
          onClose={closeChangeModal}
          activeChangeSlot={activeChangeSlot} 
          onRecipeSelected={handleRecipeSelection}
          suggestions={suggestions}
          isLoading={isLoadingSuggestions}
          mode={modalMode}
        />
      )}
      <AddExtraMealTypeModal
        isVisible={isExtraTypeModalVisible}
        onClose={() => setExtraTypeModalVisible(false)}
        onSelectType={handleExtraMealTypeSelected}
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