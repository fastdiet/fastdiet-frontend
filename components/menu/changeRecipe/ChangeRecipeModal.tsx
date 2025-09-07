
// React and React Native Imports
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';

// Components imports
import SuggestionsTab from '@/components/menu/changeRecipe/SuggestionsTab';
import MyRecipesTab from '@/components/menu/changeRecipe/MyRecipesTab';
import ChangeMealCard from '@/components/menu/changeRecipe/ChangeMealCard';


// Styles imports
import { X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

// Model imports
import { RecipeShort, SlotMeal } from '@/models/mealPlan';

interface ChangeRecipeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRecipeSelected: (newRecipe: RecipeShort) => void;
  activeChangeSlot: SlotMeal | null; 
  suggestions: RecipeShort[];
  isLoading: boolean;
  mode: 'add' | 'change';
}

const ChangeRecipeModal: React.FC<ChangeRecipeModalProps> = ({
  isVisible,
  onClose,
  activeChangeSlot,
  onRecipeSelected: onRecipeSelectedProp,
  suggestions,
  isLoading,
  mode,
}) => {
    
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'myrecipes'>('suggestions');
  const isKeyboardVisible = useKeyboardVisible();
  if (!activeChangeSlot) return null;

  const mealType = activeChangeSlot.meal_type;
  const mealTypeDisplay = t(`constants.meals.${mealType}`, { defaultValue: mealType });

  const onRecipeSelected = useCallback((newRecipe: RecipeShort) => {
    onRecipeSelectedProp(newRecipe);
  }, [onRecipeSelectedProp]);


  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {mode === 'add' ? t('add') : t('change')} {mealTypeDisplay}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={28} color={Colors.colors.gray[500]} />
          </TouchableOpacity>
        </View>
        {!isKeyboardVisible && activeChangeSlot.recipe &&(
          <View style={styles.cardWrapper}>
            <ChangeMealCard 
              recipe={activeChangeSlot.recipe!}
              mealTypeDisplay={mealTypeDisplay}
              mealType={mealType}
            />
          </View>
        )}

    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'suggestions' && styles.activeTab]}
        onPress={() => setActiveTab('suggestions')}
      >
        <Text style={[styles.tabText, activeTab === 'suggestions' && styles.activeTabText]}>
          {t('index.menu.changeMeal.suggestions')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'myrecipes' && styles.activeTab]}
        onPress={() => setActiveTab('myrecipes')}
      >
        <Text style={[styles.tabText, activeTab === 'myrecipes' && styles.activeTabText]}>
          {t('index.menu.changeMeal.myRecipes')}
        </Text>
      </TouchableOpacity>

    </View>
      <View style={styles.content}>
        {activeTab === 'suggestions' ? (
          <SuggestionsTab
            suggestions={suggestions}
            isLoading={isLoading}
            onRecipeSelect={onRecipeSelected}
          />
        ) : (
          <MyRecipesTab 
            onRecipeSelect={onRecipeSelected} 
            onCloseModal={onClose}
            filterByDishType={mealType}
          />
        )}
      </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
    
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.colors.gray[100]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[100],
    backgroundColor: Colors.colors.neutral[100],
  },
  headerTitle: {
    ...globalStyles.largeBodyBold,
    color: Colors.colors.gray[500]
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  cardWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: Colors.colors.gray[100],
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.colors.gray[200],
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.colors.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[200],
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.colors.primary[200],
  },
  tabText: {
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.gray[400],
  },
  activeTabText: {
    color: Colors.colors.primary[200],
  },
  content: {
    flex: 1,
    backgroundColor: Colors.colors.neutral[100]
  }
  
});
  
export default ChangeRecipeModal;