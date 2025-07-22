import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import RecipeListItem from '@/components/menu/RecipeListItem';
import { RecipeShort } from '@/models/mealPlan';
import { fetchRecipeSuggestions } from '@/services/recipeSuggestions';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import globalStyles from '@/styles/global';
import EmptyStateTabs from './EmptyStateTabs';


interface SuggestionsTabProps {
  onRecipeSelect: (recipe: RecipeShort) => void;
  suggestions: RecipeShort[];
  isLoading: boolean;
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ onRecipeSelect, suggestions, isLoading}) => {

  const { t } = useTranslation();
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.colors.primary[200]} />

         <Text style={styles.statusText}>{t("index.menu.changeMeal.loading")}</Text>
      </View>
    );
  }

  if (!isLoading && suggestions.length === 0) {
    return <EmptyStateTabs message={t("index.menu.changeMeal.noSuggestions")} />;
  }

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <RecipeListItem recipe={item} onSelect={onRecipeSelect} />}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    ...globalStyles.largeBody,
    color: Colors.colors.gray[400],
    marginTop: 16,
    textAlign: 'center',
  },
});

export default SuggestionsTab;