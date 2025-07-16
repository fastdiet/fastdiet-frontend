// React and Expo imports
import { View, StyleSheet, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

// Components imports
import PaddingView from '@/components/views/PaddingView';
import TitleParagraph from '@/components/text/TitleParagraph';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import MyRecipeCard from '@/components/recipe/MyRecipeCard';

// Hooks imports
import { useMyRecipes } from '@/hooks/useMyRecipes';

// Styles imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';



const MyRecipesScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { myRecipes, loading } = useMyRecipes(); 
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 68;

  const handleAddNewRecipe = () => router.push('/(home)/(tabs)/my-recipes/create');
  const handleEditRecipe = (recipeId: number) => {
    router.push({
      pathname: '/(home)/(tabs)/my-recipes/edit/[recipeId]',
      params: { recipeId: recipeId.toString() },
    });
  };
  const navigateToRecipeDetail = (recipeId: number) => {
    router.push({
      pathname: '/(home)/(tabs)/my-recipes/detail/[recipeId]',
      params: { recipeId: recipeId.toString() },
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
  console.log("MyRecipesScreen - myRecipes:", myRecipes);
  if (!myRecipes || myRecipes.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="receipt-outline" size={50} color={Colors.colors.primary[200]} />
        </View>
        <Text style={styles.emptyStateTitle}>{t('myRecipes.noRecipes.title')}</Text>
        <Text style={styles.emptyStateText}>{t('myRecipes.noRecipes.subtitle')}</Text>
        <PrimaryButton 
          title={t('myRecipes.cta.createFirst')}
          onPress={handleAddNewRecipe}
          style={{ marginTop: 24, paddingHorizontal: 32 }}
          leftIcon={<Ionicons name="add" size={20} color={Colors.colors.neutral[100]} />}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={myRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MyRecipeCard
            recipe={item}
            onPress={() => navigateToRecipeDetail(item.id)}
            onEdit={() => handleEditRecipe(item.id)}
          />
        )}
        ListHeaderComponent={
          <PaddingView>
            <TitleParagraph
              title={t('myRecipes.title')}
              paragraph={t('myRecipes.subtitle')}
              containerStyle={{ marginTop: 16, marginBottom: 24 }}
            />
          </PaddingView>
        }
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
      
      <TouchableOpacity onPress={handleAddNewRecipe} style={[styles.fab, {bottom: insets.bottom + TAB_BAR_HEIGHT + 20,}]}>
          <Ionicons name="add" size={32} color={Colors.colors.neutral[100]} />
      </TouchableOpacity>
      
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
    borderWidth: 2,
    borderColor: Colors.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    ...globalStyles.headlineSmall,
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