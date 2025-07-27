// React and Expo imports
import { View, StyleSheet, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

// Components imports
import PaddingView from '@/components/views/PaddingView';
import TitleParagraph from '@/components/text/TitleParagraph';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import MyRecipeCard from '@/components/myRecipes/MyRecipeCard';

// Hooks imports
import { useMyRecipes } from '@/hooks/useMyRecipes';

// Styles imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { BookOpen, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import FilterTabs from '@/components/myRecipes/FilterTabs';
import SearchInput from '@/components/forms/SearchInput';



const MyRecipesScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { myRecipes, loading } = useMyRecipes(); 
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 68;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');

  const recipesMatchingMealType = useMemo(() => {
    if (selectedMealType === 'all') {
      return myRecipes;
    }
    return myRecipes.filter(recipe => 
      recipe.dish_types?.map(type => type.toLowerCase()).includes(selectedMealType)
    );
  }, [myRecipes, selectedMealType]);

   const filteredRecipes = useMemo(() => {
    if (!searchQuery) {
      return recipesMatchingMealType;
    }
    return recipesMatchingMealType.filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recipesMatchingMealType, searchQuery]);

  const filterOptions = [
    { label: t('all'), value: 'all' as const },
    { label: t('constants.meals.breakfast'), value: 'breakfast' as const },
    { label: t('constants.meals.lunch'), value: 'lunch' as const },
    { label: t('constants.meals.dinner'), value: 'dinner' as const },
  ];

  const handleAddNewRecipe = () => router.push('/(home)/(tabs)/my-recipes/create');
  const handleEditRecipe = (recipeId: number) => {
    router.push({
      pathname: '/(home)/(tabs)/my-recipes/edit/[recipeId]',
      params: { recipeId: recipeId.toString() },
    });
  };
  const navigateToRecipeDetail = (recipeId : number) => {
    router.push({
      pathname: '/(home)/(tabs)/my-recipes/detail/[recipeId]',
      params: { 
        recipeId: recipeId.toString() ,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.colors.primary[200]} />
        <Text style={styles.infoText}>{t("myRecipes.loading")}</Text>
      </View>
    );
  }


  const renderEmptyState = () => {
  if (myRecipes.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.iconCircle}>
          <BookOpen size={50} color={Colors.colors.primary[200]} strokeWidth={1.5} />
        </View>
        <Text style={styles.emptyStateTitle}>{t('myRecipes.noRecipes.title')}</Text>
        <Text style={styles.emptyStateText}>{t('myRecipes.noRecipes.subtitle')}</Text>
        <PrimaryButton 
          title={t('myRecipes.cta.createFirst')}
          onPress={handleAddNewRecipe}
          style={{ marginTop: 24, paddingHorizontal: 32 }}
          leftIcon={<Plus size={20} strokeWidth={2.5} color={Colors.colors.neutral[100]} />}
        />
      </View>
    );
  }

  if (recipesMatchingMealType.length === 0 && !searchQuery && selectedMealType !== 'all') {
      const genderContext = selectedMealType === 'dinner' ? 'female' : 'male';
      const mealTypeTranslation = t(`constants.meals.${selectedMealType}`);

      return (
        <View style={styles.centeredContainer}>
          <View style={styles.iconCircle}>
            <BookOpen size={50} color={Colors.colors.primary[200]} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyStateTitle}>
            {t("myRecipes.emptyState.noDishType.title", { 
              context: genderContext, 
              mealType: mealTypeTranslation.toLowerCase() 
            })}
          </Text>
          <Text style={styles.emptyStateText}>{t('myRecipes.emptyState.noDishType.subtitle')}</Text>
        </View>
      );
    }
  
  return (
    <View style={styles.centeredContainer}>
      <View style={styles.iconCircle}>
        <BookOpen size={50} color={Colors.colors.primary[200]} strokeWidth={1.5} />
      </View>
        <Text style={styles.emptyStateTitle}>{t('myRecipes.emptyState.noSearchResults.title')}</Text>
        <Text style={styles.emptyStateText}>{t('myRecipes.emptyState.noSearchResults.subtitle')}</Text>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MyRecipeCard
            recipe={item}
            onPress={() => navigateToRecipeDetail(item.id)}
            onEdit={() => handleEditRecipe(item.id)}
          />
        )}
        ListHeaderComponent={
          <>
            <PaddingView>
            <TitleParagraph
              title={t('myRecipes.title')}
              paragraph={t('myRecipes.subtitle')}
              containerStyle={{marginTop: 16, marginBottom: 24}}
            />
            </PaddingView>
            <FilterTabs 
              options={filterOptions}
              selectedValue={selectedMealType}
              onSelect={setSelectedMealType}
            />
            <View style={styles.searchWrapper}> 
            <SearchInput 
              placeholder={t('myRecipes.searchPlaceholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
              variant="primary"
            />
            </View>
          </>
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        keyboardShouldPersistTaps="handled"
      />
      
      {myRecipes.length > 0 && (
        <TouchableOpacity onPress={handleAddNewRecipe} style={[styles.fab, {bottom: insets.bottom + TAB_BAR_HEIGHT + 20,}]}>
          <Plus size={32} color={Colors.colors.neutral[100]} />
        </TouchableOpacity>
      )}
      
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.gray[100],
  },
  centeredContainer: {
    flex: 1,
    paddingVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.colors.gray[100],
    paddingHorizontal: 24,
  },
  infoText: {
    marginTop: 12,
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.gray[400],
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.colors.primary[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    ...globalStyles.titleMedium,
    color: Colors.colors.gray[900],
    textAlign: 'center',
  },
  emptyStateText: {
    ...globalStyles.largeBody,
    color: Colors.colors.gray[500],
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '95%',
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  searchWrapper: {
    marginBottom: 20,
    marginVertical: 10,
  },
  fab: {
    position: 'absolute',
    right: 16, 
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
});

export default MyRecipesScreen;