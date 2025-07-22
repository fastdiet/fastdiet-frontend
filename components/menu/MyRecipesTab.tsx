import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import RecipeListItem from '@/components/menu/RecipeListItem';
import { RecipeShort } from '@/models/mealPlan';
import { useMyRecipes } from '@/hooks/useMyRecipes';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import SearchInput from '@/components/forms/SearchInput';
import EmptyStateTabs from './EmptyStateTabs';


interface MyRecipesTabProps {
  onRecipeSelect: (recipe: RecipeShort) => void;
}

const MyRecipesTab: React.FC<MyRecipesTabProps> = ({ onRecipeSelect }) => {
  const { myRecipes } = useMyRecipes();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return myRecipes;
    return myRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, myRecipes]);


  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <SearchInput
          placeholder="Buscar en mis recetas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </View>
       <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RecipeListItem recipe={item} onSelect={onRecipeSelect} />}
        ListEmptyComponent={<EmptyStateTabs message="No tienes recetas que coincidan con tu búsqueda." />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 searchWrapper: {
    padding: 16,
    paddingBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    ...globalStyles.largeBody,
    color: Colors.colors.gray[900], 
  },
});

export default MyRecipesTab;