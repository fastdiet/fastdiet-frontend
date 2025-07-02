// React and expo imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface QuickInfoBarProps {
  totalTime?: number | null;
  calories?: number | null;
  servings?: number | null;
}

const QuickInfoBar: React.FC<QuickInfoBarProps> = React.memo(({ totalTime, calories, servings }) => {
  const { t } = useTranslation();

  if (totalTime == null && calories == null && servings == null) return null;

  return (
    <View style={styles.quickInfoBar}>
      {totalTime != null && totalTime >= 0 && (
        <View style={styles.quickInfoItem}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.colors.gray[400]} />
          <Text style={styles.quickInfoText}>{totalTime} {t("units.minutesShort")}</Text>
        </View>
      )}
      {calories != null && calories > 0 && (
        <View style={styles.quickInfoItem}>
          <MaterialCommunityIcons name="fire" size={20} color={Colors.colors.gray[400]} />
          <Text style={styles.quickInfoText}>{calories} {t("units.kcal")}</Text>
        </View>
      )}
      {servings != null && servings > 0 && (
        <View style={styles.quickInfoItem}>
          <MaterialCommunityIcons name="account-group-outline" size={20} color={Colors.colors.gray[400]} />
          <Text style={styles.quickInfoText}>
            {servings} {servings > 1 ? t("units.servings") : t("units.serving")}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  quickInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 12,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: Colors.colors.gray[100],
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickInfoText: {
    ...globalStyles.smallBodySemiBold,
    color: Colors.colors.gray[500],
  },
});

export default QuickInfoBar;