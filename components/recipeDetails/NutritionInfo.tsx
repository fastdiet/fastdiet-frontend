// React and expo imports
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/// Models imports
import { NutrientDetail } from '@/models/mealPlan';

// Components imports
import Section from '@/components/ui/Section';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface NutritionInfoProps {
  nutrients?: NutrientDetail[];
  calories?: number | null;
}

const NutritionInfo: React.FC<NutritionInfoProps> = React.memo(({ nutrients, calories }) => {
  const { t } = useTranslation();
  const [showAllNutrients, setShowAllNutrients] = useState(false);

  const { primary, secondary } = useMemo(() => {
    if (!nutrients) return { primary: [], secondary: [] };
    const primaryNutrients = nutrients.filter(n => n.is_primary && n.name.toLowerCase() !== 'calories');
    const secondaryNutrients = nutrients.filter(n => !n.is_primary);
    return { primary: primaryNutrients, secondary: secondaryNutrients };
  }, [nutrients]);

  if (!nutrients || nutrients.length === 0) {
    return null;
  }

  const formatAmount = (amount: number, unit: string) => {
    if (unit === 'mg' || unit === 'µg' || amount < 10) {
      return amount.toFixed(1);
    }
    return Math.round(amount);
  };

  return (
    <Section title={t("index.menu.recipe.nutritionalInfoSectionTitle")} iconName="chart-bar" defaultOpen={false}>
      {calories !== null && (
        <View style={styles.nutritionRowFeatured}>
          <Text style={styles.nutritionLabelFeatured}>{t('nutrients.calories', 'Calorías')}:</Text>
          <Text style={styles.nutritionValueFeatured}>{calories}{t('units.kcal')}</Text>
        </View>
      )}

      {primary.map((nutrient) => (
        <View key={`nutrient-primary-${nutrient.name}`} style={styles.nutritionRow}>
          <Text style={styles.nutritionLabel} numberOfLines={1}>
            {t(`nutrients.${nutrient.name.toLowerCase().replace(/\s/g, '')}`, nutrient.name)}:
          </Text>
          <Text style={styles.nutritionValue}>
            {formatAmount(nutrient.amount, nutrient.unit)}{nutrient.unit}
          </Text>
        </View>
      ))}

      {secondary.length > 0 && (
        <TouchableOpacity
          style={styles.showAllNutrientsButton}
          onPress={() => setShowAllNutrients(!showAllNutrients)}
          activeOpacity={0.7}
        >
          <Text style={styles.showAllNutrientsText}>
            {showAllNutrients ? t('index.menu.recipe.hideDetailedNutrients') : t('index.menu.recipe.showDetailedNutrients')}
          </Text>
          <MaterialCommunityIcons
            name={showAllNutrients ? "chevron-up" : "chevron-down"}
            size={22}
            color={Colors.colors.primary[100]}
          />
        </TouchableOpacity>
      )}

      {showAllNutrients && secondary.map((nutrient) => (
        <View key={`nutrient-secondary-${nutrient.name}`} style={styles.nutritionRow}>
          <Text style={styles.nutritionLabelSecondary} numberOfLines={1}>
            {t(`nutrients.${nutrient.name.toLowerCase().replace(/\s/g, '')}`, nutrient.name)}:
          </Text>
          <Text style={styles.nutritionValueSecondary}>
            {formatAmount(nutrient.amount, nutrient.unit)}{nutrient.unit}
          </Text>
        </View>
      ))}
    </Section>
  );
});

const styles = StyleSheet.create({
  nutritionRowFeatured: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.colors.primary[600],
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: -16,
    marginBottom: 12,
  },
  nutritionLabelFeatured: {
    ...globalStyles.mediumBodyBold,
    color: Colors.colors.primary[100],
  },
  nutritionValueFeatured: {
    ...globalStyles.mediumBodyBold,
    color: Colors.colors.primary[100],
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[100],
  },
  nutritionLabel: {
    ...globalStyles.mediumBodyRegular,
    color: Colors.colors.gray[400],
    flexShrink: 1,
    marginRight: 8,
  },
  nutritionValue: {
    ...globalStyles.mediumBodySemiBold,
    color: Colors.colors.gray[500],
    textAlign: 'right',
  },
  showAllNutrientsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  showAllNutrientsText: {
    ...globalStyles.smallBodySemiBold,
    fontSize: 14,
    color: Colors.colors.primary[100],
  },
  nutritionLabelSecondary: {
    ...globalStyles.smallBodyRegular,
    fontSize: 14,
    color: Colors.colors.gray[400],
    flexShrink: 1,
    marginRight: 8,
  },
  nutritionValueSecondary: {
    ...globalStyles.smallBodySemiBold,
    fontSize: 14,
    color: Colors.colors.gray[500],
    textAlign: 'right',
  },
});

export default NutritionInfo;