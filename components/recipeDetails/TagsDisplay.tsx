// React and expo imports
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { useTranslation } from 'react-i18next';

interface TagsDisplayProps {
  cuisines?: string[];
  dishTypes?: string[];
  diets?: string[];
}

const TagsDisplay: React.FC<TagsDisplayProps> = React.memo(({ cuisines, dishTypes, diets }) => {
  const hasTags = cuisines?.length || dishTypes?.length || diets?.length;
  const { t } = useTranslation();
  if (!hasTags) {
    return null;
  }

  const uniqueDishTypes = useMemo(() => {
    if (!dishTypes?.length) {
      return [];
    }
    const seenTranslations = new Set();
    return dishTypes.filter(dish => {
      const translatedDish = t(`constants.meals.${dish}`);
      if (seenTranslations.has(translatedDish)) {
        return false;
      }
      seenTranslations.add(translatedDish);
      return true;
    });
  }, [dishTypes, t]);

  return (
    <View style={styles.tagsContainer}>
      {cuisines?.map(cuisine => (
        <View key={`cuisine-${cuisine}`} style={[styles.tag, styles.cuisineTag]}>
          <Text style={[styles.tagText, styles.cuisineTagText]}>{t(`constants.cuisines.${cuisine}`)}</Text>
        </View>
      ))}
      {uniqueDishTypes?.map(dish => (
        <View key={`dish-${dish}`} style={[styles.tag, styles.genericTag]}>
          <Text style={[styles.tagText, styles.genericTagText]}>{t(`constants.meals.${dish}`)}</Text>
        </View>
      ))}
      {diets?.map(diet => (
        <View key={`diet-${diet}`} style={[styles.tag, styles.dietTag]}>
          <Text style={[styles.tagText, styles.dietTagText]}>{t(`constants.dietTags.${diet}`)}</Text>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    ...globalStyles.smallBodySemiBold,
  },
  cuisineTag: {
    backgroundColor: Colors.colors.primary[600],
    borderColor: Colors.colors.primary[200],
  },
  cuisineTagText: {
    color: Colors.colors.primary[200],
  },
  genericTag: {
    backgroundColor: Colors.colors.accent[400],
    borderColor: Colors.colors.accent[200],
  },
  genericTagText: {
    color: Colors.colors.accent[100],
  },
  dietTag: {
    backgroundColor: Colors.colors.success[100],
    borderColor: Colors.colors.success[100],
  },
  dietTagText: {
    color: Colors.colors.neutral[100],
  },
});

export default TagsDisplay;