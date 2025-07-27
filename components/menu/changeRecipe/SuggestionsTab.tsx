
// React and react native imports
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

// Components imports
import RecipeListItem from '@/components/menu/changeRecipe/RecipeListItem';
import EmptyStateTabs from '@/components/menu/changeRecipe/EmptyStateTabs';

// Model imports
import { RecipeShort } from '@/models/mealPlan';

// Styles imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

import { UtensilsCrossed } from 'lucide-react-native';


interface SuggestionsTabProps {
  onRecipeSelect: (recipe: RecipeShort) => void;
  suggestions: RecipeShort[];
  isLoading: boolean;
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ onRecipeSelect, suggestions, isLoading}) => {

  const { t } = useTranslation();

  const handleRecipeSelect = useCallback((recipe: RecipeShort) => {
      onRecipeSelect(recipe);
    }, [onRecipeSelect]);
    
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.colors.primary[200]} />
         <Text style={styles.statusText}>{t("index.menu.changeMeal.loading")}</Text>
      </View>
    );
  }

  const renderEmptyState = () => {
    return (
      <EmptyStateTabs
          title={t("index.menu.changeMeal.noSuggestions.title")}
          subtitle={t("index.menu.changeMeal.noSuggestions.subtitle")}
          icon={<UtensilsCrossed size={40} color={Colors.colors.primary[200]} strokeWidth={1} />}
      />
    );
    
  };

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item) => item.id!.toString()}
      renderItem={({ item }) => <RecipeListItem recipe={item} onSelect={handleRecipeSelect} />}
      ListEmptyComponent={renderEmptyState}
      contentContainerStyle={styles.listContentContainer}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={11}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    ...globalStyles.largeBody,
    color: Colors.colors.gray[400],
    marginTop: 16,
    textAlign: 'center',
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  }
});

export default SuggestionsTab;