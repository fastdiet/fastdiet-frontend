// React and react native imports
import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

// Component imports
import EmptyStateTabs from '@/components/menu/changeRecipe/EmptyStateTabs';
import RecipeListItem from '@/components/menu/changeRecipe/RecipeListItem';
import SearchInput from '@/components/forms/SearchInput';

// Hooks imports
import { useMyRecipes } from '@/hooks/useMyRecipes';

// Model imports
import { RecipeShort } from '@/models/mealPlan';

// Style imports
import { Colors } from '@/constants/Colors';
import { Search } from 'lucide-react-native';



interface MyRecipesTabProps {
  onRecipeSelect: (recipe: RecipeShort) => void;
  onCloseModal: () => void;
  filterByDishType?: "breakfast" | "lunch" | "dinner";
}

const MyRecipesTab: React.FC<MyRecipesTabProps> = ({ onRecipeSelect, onCloseModal, filterByDishType }) => {
  const { myRecipes } = useMyRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const router = useRouter();

  const recipesMatchingDishType = useMemo(() => {
    if (!filterByDishType) {
      return myRecipes;
    }
    return myRecipes.filter(recipe =>
      recipe.dish_types?.map(type => type.toLowerCase()).includes(filterByDishType)
    );
  }, [myRecipes, filterByDishType]);

  const filteredRecipes = useMemo(() => {
    if (!searchQuery) {
      return recipesMatchingDishType;
    }
    return recipesMatchingDishType.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, recipesMatchingDishType]);

  const handleRecipeSelect = useCallback((recipe: RecipeShort) => {
    onRecipeSelect(recipe);
  }, [onRecipeSelect]);

  const handleCreateRecipe = () => {
    onCloseModal();
    router.push('/(home)/(tabs)/my-recipes/create')
  };

  const renderEmptyState = () => {
    if (myRecipes.length === 0) {
      return (
        <EmptyStateTabs
          title={t("myRecipes.emptyState.noRecipes.title")}
          subtitle={t("myRecipes.emptyState.noRecipes.subtitle")}
          cta={{
            title: t("myRecipes.emptyState.noRecipes.cta"),
            onPress: handleCreateRecipe,
          }}
        />
      );
    }

     if (recipesMatchingDishType.length === 0 && !searchQuery) {
      const genderContext = filterByDishType === 'dinner' ? 'female' : 'male';
      const mealTypeTranslation = t(`constants.meals.${filterByDishType}`);
      return (
        <EmptyStateTabs
         title={t("myRecipes.emptyState.noDishType.title", { 
            mealType: mealTypeTranslation, 
            context: genderContext 
          })}
          subtitle={t("myRecipes.emptyState.noDishType.subtitle")}
         cta={{
            title: t("myRecipes.emptyState.noDishType.cta", { 
              mealType: mealTypeTranslation, 
              context: genderContext 
            }),
            onPress: handleCreateRecipe,
          }}
        />
      );
    }

     return (
      <EmptyStateTabs
        title={t("myRecipes.emptyState.noSearchResults.title")}
        subtitle={t("myRecipes.emptyState.noSearchResults.subtitle")}
        icon={<Search size={40} color={Colors.colors.gray[300]} strokeWidth={1} />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <SearchInput
          placeholder={t("myRecipes.searchPlaceholder")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          variant="secondary"
        />
      </View>
     
      <FlatList
        data={filteredRecipes}
        renderItem={({ item }) => <RecipeListItem recipe={item} onSelect={handleRecipeSelect} />}
        keyExtractor={(item) => item.id!.toString()}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContentContainer}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={11}
        keyboardShouldPersistTaps="handled"
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.colors.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[200],
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  }
});

export default MyRecipesTab;