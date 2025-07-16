import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { useTranslation } from 'react-i18next';
import StyledTextInput from '../forms/StyledTextInput';
import { FormInputStep } from '@/models/recipeInput';
import { nanoid } from 'nanoid/non-secure';


interface StepInputListProps {
  steps:  FormInputStep[];
  setSteps: (steps: FormInputStep[]) => void;
}

const StepInputList = ({ steps, setSteps }: StepInputListProps) => {
  const { t } = useTranslation();

  const handleAddStep = () => {
    setSteps([...steps, { id: nanoid(), description: '' }]);
  };

  const handleStepChange = (id: string, newDescription: string) => {
    const updatedSteps = steps.map(step =>
      step.id === id ? { ...step, description: newDescription } : step
    );
    setSteps(updatedSteps);
  };

  const handleRemoveStep = (id: string) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    setSteps(updatedSteps);
  };

  return (
     <View style={[styles.container, steps.length != 0 ? { marginTop: 8 } : {}]}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepRow}>
          <Text style={styles.stepNumber}>{index + 1}.</Text>
          <View style={{ flex: 1 }}>
            <StyledTextInput
              value={step.description}
              onChangeText={(text) => handleStepChange(step.id, text)}
              placeholder={t('myRecipes.form.stepDescription', { number: index + 1 })} 
              multiline
              textAlignVertical="top"
              
            />
          </View>
          <TouchableOpacity onPress={() => handleRemoveStep(step.id)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color={Colors.colors.gray[400]} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
        <Ionicons name="add-circle-outline" size={24} color={Colors.colors.primary[100]} />
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
    marginBottom: 10,
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
    paddingVertical: 0,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  addButtonText: {
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.primary[100],
    marginLeft: 8,
  }
});

export default StepInputList;