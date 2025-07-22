// React and expo imports
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import SegmentedControlTab from 'react-native-segmented-control-tab';

/// Models imports
import { RecipeIngredient } from '@/models/mealPlan';

// Components imports
import Section from '@/components/ui/Section';


// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Info, List } from 'lucide-react-native';
import { formatAmount } from '@/utils/clean';

const INGREDIENT_IMAGE_BASE_URL = "https://img.spoonacular.com/ingredients_100x100/";

interface IngredientListProps {
  ingredients?: RecipeIngredient[];
}


const IngredientList: React.FC<IngredientListProps> = React.memo(({ ingredients }) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const unitSystem = selectedIndex === 0 ? 'metric' : 'us';
  const hasSwitchableUnits = ingredients?.some(ing => ing.measures_json?.us && ing.measures_json?.metric) ?? false;

  if (!ingredients || ingredients.length === 0) {
    return (
      <Section title={t("index.menu.recipe.ingredientsSectionTitle")} iconComponent={List}>
        <View style={styles.emptyContainer}>
          <Info size={21} strokeWidth={2.3} color={Colors.colors.gray[400]} />
          <Text style={styles.emptyText}>{t('recipes.noIngredientsMessage')}</Text>
        </View>
      </Section>
    );
  }

  return (
    <Section 
      title={t("index.menu.recipe.ingredientsSectionTitle")}
      iconComponent={List}
      contentStyle={{ paddingBottom: 0 }}
    >
      {hasSwitchableUnits && (
          <SegmentedControlTab
            values={[t('recipes.units.metric'), t('recipes.units.imperial')]}
            selectedIndex={selectedIndex}
            onTabPress={setSelectedIndex}
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.activeTabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabTextStyle={styles.activeTabTextStyle}
          />
      )}
      {ingredients.map((ing) => {
        const measure = ing.measures_json?.[unitSystem];
        const formattedAmount = measure ? formatAmount(measure.amount) : formatAmount(ing.amount);
        const unit = measure?.unitShort || ing.unit || "";

        return (
          <View key={`ingredient-${ing.ingredient.id}`} style={styles.ingredientItem}>
            {ing.ingredient.image_filename ? (
              <Image
                source={{ uri: `${INGREDIENT_IMAGE_BASE_URL}${ing.ingredient.image_filename}` }}
                style={styles.ingredientImage}
              />
            ) : (
              <View style={[styles.ingredientImage, styles.placeholderImage]}>
                <MaterialCommunityIcons name="food-variant" size={24} color={Colors.colors.gray[300]} />
              </View>
            )}
            <View style={styles.ingredientTextContainer}>
              <Text style={styles.ingredientName} numberOfLines={2} ellipsizeMode="tail">
                {ing.ingredient.name}
              </Text>
            </View>
            <Text style={styles.ingredientQuantity}>
              {formattedAmount} {unit}
            </Text>
          </View>
        );
      })}
    </Section>
  );
});

const styles = StyleSheet.create({
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.colors.gray[100],
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
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.colors.gray[100],
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colors.gray[100],
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.colors.gray[200],
  },
  emptyText: {
    ...globalStyles.largeBody,
    color: Colors.colors.gray[700],
    marginLeft: 8,
    flex: 1,
  },
  tabsContainerStyle: {
    height: 38,
    backgroundColor: Colors.colors.gray[100],
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 14,
  },
  tabStyle: {
    backgroundColor: Colors.colors.gray[100],
    borderColor: 'transparent',
    borderWidth: 0,
  },
  activeTabStyle: {
    backgroundColor: Colors.colors.primary[100],
    borderRadius: 6,
  },
  tabTextStyle: {
    ...globalStyles.largeBodyMedium,
    color: Colors.colors.gray[400],
  },
  activeTabTextStyle: {
    ...globalStyles.largeBodyMedium,
    color: Colors.colors.neutral[100],
  },
});

export default IngredientList;