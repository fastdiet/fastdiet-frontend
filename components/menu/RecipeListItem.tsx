import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Flame, Users } from 'lucide-react-native';
import { RecipeShort } from '@/models/mealPlan';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface RecipeListItemProps {
  recipe: RecipeShort;
  onSelect: (recipe: RecipeShort) => void;
}

const RecipeListItem: React.FC<RecipeListItemProps> = ({ recipe, onSelect }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      onPress={() => onSelect(recipe)}
    >
      <Image 
        source={recipe.image_url ? { uri: recipe.image_url } : require('@/assets/images/recipe-placeholder.jpg')} 
        style={styles.image} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        <View style={styles.bottomInfoOverlay}>
            {recipe.calories != null && (
                <View style={styles.infoPill}>
                    <Flame size={14} color={Colors.colors.accent[100]} />
                    <Text style={styles.infoText}>{Math.round(recipe.calories)} kcal</Text>
                </View>
            )}
            {recipe.ready_min != null && (
                <View style={styles.infoPill}>
                    <Clock size={14} color={Colors.colors.gray[500]} />
                    <Text style={styles.infoText}>{recipe.ready_min} min</Text>
                </View>
            )}
            {recipe.calories == null && recipe.servings != null && (
                <View style={styles.infoPill}>
                    <Users size={14} color={Colors.colors.gray[500]} />
                    <Text style={styles.infoText}>{recipe.servings}</Text>
                </View>
            )}
        </View>
        
      </View>
      <View style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Elegir</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.colors.neutral[100],
    borderBottomWidth: 1.2,
    borderBottomColor: Colors.colors.gray[100],
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.colors.gray[100],
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    justifyContent: 'center',
  },
  title: {
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.gray[900],
  },
  bottomInfoOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    ...globalStyles.mediumBodyRegular,
    color: Colors.colors.gray[500],
    marginLeft: 4,
  },
  selectButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.colors.primary[200],
    borderRadius: 20,
  },
  selectButtonText: {
    ...globalStyles.smallBodySemiBold,
    fontSize: 14,
    color: Colors.colors.neutral[100],
  },
});

export default RecipeListItem;