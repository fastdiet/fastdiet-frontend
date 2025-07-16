// React and expo imports
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

/// Models imports
import { RecipeIngredient } from '@/models/mealPlan';

// Components imports
import Section from '@/components/ui/Section';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

const INGREDIENT_IMAGE_BASE_URL = "https://img.spoonacular.com/ingredients_100x100/";

interface IngredientListProps {
  ingredients?: RecipeIngredient[];
}

const IngredientList: React.FC<IngredientListProps> = React.memo(({ ingredients }) => {
  const { t } = useTranslation();

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <Section title={t("index.menu.recipe.ingredientsSectionTitle")} iconName="format-list-bulleted">
      {ingredients.map((ing) => (
        <View key={`ingredient-${ing.ingredient.id}`} style={styles.ingredientItem}>
          {ing.ingredient.image_filename && (
            <Image
              source={{ uri: `${INGREDIENT_IMAGE_BASE_URL}${ing.ingredient.image_filename}` }}
              style={styles.ingredientImage}
            />
          )}
          <View style={styles.ingredientTextContainer}>
            <Text style={styles.ingredientName} numberOfLines={2} ellipsizeMode="tail">
              {ing.ingredient.name}
            </Text>
          </View>
          <Text style={styles.ingredientQuantity}>
            {Math.round(ing.amount)} {ing.unit || ""}
          </Text>
        </View>
      ))}
    </Section>
  );
});

const styles = StyleSheet.create({
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[100],
  },
  ingredientImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: Colors.colors.gray[100],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
  ingredientTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  ingredientName: {
    ...globalStyles.mediumBodyMedium,
    color: Colors.colors.gray[500],
    textTransform: 'capitalize',
    lineHeight: 18,
  },
  ingredientQuantity: {
    ...globalStyles.mediumBodySemiBold,
    color: Colors.colors.gray[400],
    minWidth: 70,
    textAlign: 'right',
  },
});

export default IngredientList;