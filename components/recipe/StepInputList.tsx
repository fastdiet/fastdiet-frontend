import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Step } from '@/models/myRecipe';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import LabeledTextInput from '../forms/LabeledTextInput';
import FormLabel from '../forms/FormLabel';
import { useTranslation } from 'react-i18next';
import StyledTextInput from '../forms/StyledTextInput';

interface Props {
  steps: Step[];
  setSteps: (steps: Step[]) => void;
}

const StepInputList = ({ steps, setSteps }: Props) => {
    const { t } = useTranslation();

  const handleUpdate = (index: number, value: string) => {
    const updated = [...steps];
    updated[index].description = value;
    setSteps(updated);
  };

  const handleAdd = () => {
    setSteps([...steps, { description: '' }]);
  };

  const handleRemove = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
  };

  return (
    <View style={styles.container}>
      <FormLabel text={t('myRecipes.form.steps')} />
      {steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <Text style={styles.stepNumber}>{index + 1}.</Text>
          {/* APLICAMOS EL ESTILO AL VIEW ENVOLVENTE */}
          <View style={{ flex: 1 }}>
            <StyledTextInput
            //   label={t('myRecipes.form.stepDescription', { number: index + 1 })}
            //   hideLabel
              value={step.description}
              onChangeText={(v) => handleUpdate(index, v)}
              placeholder={t('myRecipes.form.stepDescription', { number: index + 1 })}
              multiline
            />
          </View>
          <TouchableOpacity onPress={() => handleRemove(index)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color={Colors.colors.gray[400]} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Ionicons name="add-circle-outline" size={24} color={Colors.colors.primary[200]} />
        <Text style={styles.addButtonText}>{t('myRecipes.form.addStep')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 16,
    },
    stepNumber: {
        ...globalStyles.mediumBodyBold,
        color: Colors.colors.gray[400],
        paddingTop: 12, 
    },
    deleteButton: {
        paddingTop: 12,
        padding: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    addButtonText: {
        ...globalStyles.mediumBodySemiBold,
        color: Colors.colors.primary[200],
        marginLeft: 8,
    }
});

export default StepInputList;