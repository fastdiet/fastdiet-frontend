// React and expo imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

/// Models imports
import { AnalyzedInstruction } from '@/models/mealPlan';

// Components imports
import Section from '@/components/ui/Section';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface InstructionListProps {
  instructions?: AnalyzedInstruction[] | null;
}

const InstructionList: React.FC<InstructionListProps> = React.memo(({ instructions }) => {
  const { t } = useTranslation();

  if (!instructions || instructions.length === 0) {
    return null;
  }

  return (
    <Section title={t("index.menu.recipe.instructionsSectionTitle")} iconName="chef-hat">
      {instructions.map((group, groupIndex) => (
        <View key={`instruction-group-${groupIndex}`}>
          {group.name && <Text style={styles.instructionGroupName}>{group.name}</Text>}
          {group.steps.map((step) => (
            <View key={`step-${groupIndex}-${step.number}`} style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>{step.number}.</Text>
              <Text style={styles.instructionText}>{step.step}</Text>
            </View>
          ))}
        </View>
      ))}
    </Section>
  );
});

const styles = StyleSheet.create({
  instructionGroupName: {
    ...globalStyles.mediumBodyBold,
    color: Colors.colors.gray[500],
    marginTop: 12,
    marginBottom: 6,
  },
  instructionItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    ...globalStyles.mediumBodyBold,
    color: Colors.colors.primary[100],
    marginRight: 12,
    minWidth: 24,
    lineHeight: 22,
    textAlign: 'left',
  },
  instructionText: {
    ...globalStyles.mediumBodyRegular,
    color: Colors.colors.gray[500],
    flex: 1,
    lineHeight: 22,
  },
});

export default InstructionList;