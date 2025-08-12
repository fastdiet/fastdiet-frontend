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
import { ChefHat, FileText } from 'lucide-react-native';

interface InstructionListProps {
  instructions?: AnalyzedInstruction[] | null | undefined;
}

const InstructionList: React.FC<InstructionListProps> = React.memo(({ instructions }) => {
  const { t } = useTranslation();

   const flattenedSteps = useMemo(() => {
    if (!instructions || instructions.length === 0) {
      return [];
    }

    const allSteps: { type: 'group' | 'step'; content: string; number?: number }[] = [];
    let stepCounter = 1;

    instructions.forEach(group => {
      if (group.name) {
        allSteps.push({ type: 'group', content: group.name });
      }
      group.steps.forEach(step => {
        allSteps.push({
          type: 'step',
          content: step.step,
          number: stepCounter,
        });
        stepCounter++;
      });
    });

    return allSteps;
  }, [instructions]);

  if (flattenedSteps.length === 0) {
    return (
      <Section title={t("index.menu.recipe.instructionsSectionTitle")} icon={ChefHat}>
        <View style={styles.emptyContainer}>
          <FileText size={21} color={Colors.colors.gray[400]} />
          <Text style={styles.emptyText}>{t('recipes.noInstructionsMessage')}</Text>
        </View>
      </Section>
    );
  }

  return (
    <Section title={t("index.menu.recipe.instructionsSectionTitle")} icon={ChefHat}>
      {flattenedSteps.map((item, index) => {
        if (item.type === 'group') {
          return <Text key={`item-${index}`} style={styles.instructionGroupName}>{item.content}</Text>;
        }
         return (
          <View key={`item-${index}`} style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>{item.number}.</Text>
            <Text style={styles.instructionText}>{item.content}</Text>
          </View>
        );
      })}
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
});

export default InstructionList;