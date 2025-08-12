// React and expo imports
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

/// Models imports
import { AnalyzedInstruction } from '@/models/mealPlan';

// Components imports
import Section from '@/components/ui/Section';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { Wrench } from 'lucide-react-native';

const getUniqueEquipment = (instructions: AnalyzedInstruction[]): string[] => {

  const equipmentSet = new Set<string>();
  instructions.forEach(group => {
    group.steps.forEach(step => {
      step.equipment?.forEach(eq => {
        equipmentSet.add(eq.localizedName || eq.name);
      });
    });
  });
  return Array.from(equipmentSet);
};

interface EquipmentGridProps {
  instructions?: AnalyzedInstruction[] | null;
}

const EquipmentGrid: React.FC<EquipmentGridProps> = React.memo(({ instructions }) => {
  const { t } = useTranslation();

  if (!instructions || instructions.length === 0) {
    return null;
  }

  const equipmentList = useMemo(() => getUniqueEquipment(instructions), [instructions]);

  if (equipmentList.length === 0) {
    return null;
  }

  return (
    <Section title={t("index.menu.recipe.equipmentSectionTitle")} icon={Wrench} defaultOpen={false}>
      <View style={styles.equipmentGrid}>
        {equipmentList.map((item, index) => (
          <View key={`equip-${index}-${item}`} style={styles.equipmentItemChip}>
            <Text style={styles.equipmentTextChip}>{t(`constants.equipment.${item}`)}</Text>
          </View>
        ))}
      </View>
    </Section>
  );
});

const styles = StyleSheet.create({
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  equipmentItemChip: {
    backgroundColor: Colors.colors.gray[100],
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  equipmentTextChip: {
    ...globalStyles.smallBodySemiBold,
    color: Colors.colors.gray[500],
    //textTransform: 'capitalize',
    lineHeight: 20
  },
});

export default EquipmentGrid;