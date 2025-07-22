import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import SuggestionsTab from '@/components/menu/SuggestionsTab';
import MyRecipesTab from '@/components/menu/MyRecipesTab';
import { X } from 'lucide-react-native';
import { RecipeShort } from '@/models/mealPlan';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface ChangeRecipeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRecipeSelected: (newRecipe: RecipeShort) => void;
  recipeToChange: RecipeShort | null;
  suggestions: RecipeShort[];
  isLoading: boolean;
}

const ChangeRecipeModal: React.FC<ChangeRecipeModalProps> = ({
  isVisible,
  onClose,
  recipeToChange,
  onRecipeSelected,
  suggestions,
  isLoading
}) => {
    
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'myrecipes'>('suggestions');

  if (!recipeToChange) return null;


  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('index.menu.changeMeal.title')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={28} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subHeader}>
          {t('index.menu.changeMeal.replace')}: <Text style={styles.recipeName}>{recipeToChange.title}</Text>
        </Text>

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
              onRecipeSelect={onRecipeSelected} 
              suggestions={suggestions}
              isLoading={isLoading}
            />
          ) : (
            <MyRecipesTab onRecipeSelect={onRecipeSelected} />
          )}
        </View>
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
    borderBottomColor: Colors.colors.gray[200],
    backgroundColor: Colors.colors.neutral[100],
  },
  headerTitle: {
    ...globalStyles.titleMedium,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  subHeader: {
    ...globalStyles.largeBody,
    textAlign: 'center',
    padding: 16,
    backgroundColor: Colors.colors.neutral[100],
  },
  recipeName: {
    fontFamily: 'InterSemiBold',
    color: Colors.colors.gray[900],
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
  },
});
  
export default ChangeRecipeModal;