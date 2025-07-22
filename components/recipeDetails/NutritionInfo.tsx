// React and expo imports
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

/// Models imports
import { NutrientDetail } from '@/models/mealPlan';

// Components imports
import Section from '@/components/ui/Section';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { BarChart3, Beef, ChevronDown, ChevronUp, Droplets, HelpCircle, Wheat } from 'lucide-react-native';
import { formatAmount } from '@/utils/clean';

interface NutritionInfoProps {
  nutrients?: NutrientDetail[];
  calories?: number | null;
}

const getMacroVisuals = (nutrientName: string) => {
  const name = nutrientName.toLowerCase();
  if (name.includes('protein')) {
    return { Icon: Beef, color: Colors.colors.protein[100] };
  }
  if (name.includes('carbohydrates')) {
    return { Icon: Wheat, color: Colors.colors.accent[100] };
  }
  if (name.includes('fat')) {
    return { Icon: Droplets, color: Colors.colors.error[100] };
  }
  return { Icon: HelpCircle, color: Colors.colors.gray[300] };
};



const MacroNutrient: React.FC<{ nutrient: NutrientDetail }> = ({ nutrient }) => {
  const { t } = useTranslation();
  const { Icon, color } = getMacroVisuals(nutrient.name);
  const label = t(`nutrients.${nutrient.name.toLowerCase().replace(/\s/g, '')}`, nutrient.name);
  const value = `${formatAmount(nutrient.amount)}${nutrient.unit}`;
  
  return (
    <View style={styles.macroCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
       <Icon size={28} color={color} />
      </View>
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
};



const NutritionInfo: React.FC<NutritionInfoProps> = React.memo(({ nutrients, calories }) => {
  const { t } = useTranslation();
  const [showAllNutrients, setShowAllNutrients] = useState(false);

  const { topTier, midTier, secondary } = useMemo(() => {
    if (!nutrients) return { topTier: [], midTier: [], secondary: [] };
    const topTierNames = ['protein', 'carbohydrates', 'fat'];
    const topTier: NutrientDetail[] = [];
    const midTier: NutrientDetail[] = [];
    const secondaryTier: NutrientDetail[] = [];

    nutrients.forEach(n => {
      const nameLower = n.name.toLowerCase();
      if (nameLower === 'calories') return;
      if (topTierNames.includes(nameLower)) {
        topTier.push(n);
      } else if (n.is_primary) {
        midTier.push(n);
      } else {
        secondaryTier.push(n);
      }
    });

    return { topTier, midTier, secondary: secondaryTier };
  }, [nutrients]);

  if (!nutrients || nutrients.length === 0) {
    return null;
  }

  return (
    <Section 
      title={t("index.menu.recipe.nutritionalInfoSectionTitle")}
      iconComponent={BarChart3} 
      defaultOpen={false}
      contentStyle={{ paddingBottom: 0 }}
    >
      {calories !== null && (
        <View style={styles.nutritionRowFeatured}>
          <Text style={styles.nutritionLabelFeatured}>{t('nutrients.calories')}:</Text>
          <Text style={styles.nutritionValueFeatured}>{calories}{t('units.kcal')}</Text>
        </View>
      )}

      <View style={styles.macrosContainer}>
        {topTier.map((nutrient) => (
          <MacroNutrient
            key={`nutrient-top-${nutrient.name}`}
            nutrient={nutrient}
          />
        ))}
      </View>

      {midTier.map((nutrient) => (
        <View key={`nutrient-mid-${nutrient.name}`} style={styles.nutritionRow}>
          <Text style={styles.nutritionLabel}>
            {t(`nutrients.${nutrient.name.toLowerCase().replace(/\s/g, '')}`, nutrient.name)}
          </Text>
          <Text style={styles.nutritionValue}>
            {formatAmount(nutrient.amount)}{nutrient.unit}
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
          {showAllNutrients ? (
            <ChevronUp size={22} color={Colors.colors.gray[300]} />
          ) : (
            <ChevronDown size={22} color={Colors.colors.gray[300]} />
          )}
        </TouchableOpacity>
      )}

      {showAllNutrients && secondary.map((nutrient) => (
        <View key={`nutrient-secondary-${nutrient.name}`} style={styles.nutritionRow}>
          <Text style={styles.nutritionLabelSecondary} numberOfLines={1}>
            {t(`nutrients.${nutrient.name.toLowerCase().replace(/\s/g, '')}`, nutrient.name)}:
          </Text>
          <Text style={styles.nutritionValueSecondary}>
            {formatAmount(nutrient.amount)}{nutrient.unit}
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
    marginHorizontal: -16,
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
    borderTopWidth: 1,
    borderTopColor: Colors.colors.gray[100],
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
    paddingVertical: 10,
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



  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[100],
  },
  macroCard: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  macroValue: {
    ...globalStyles.subtitle,
    color: Colors.colors.gray[700],
  },
  macroLabel: {
    ...globalStyles.mediumBodyRegular,
    color: Colors.colors.gray[400],
    marginTop: 4,
    textTransform: 'capitalize',
  },
});

export default NutritionInfo;