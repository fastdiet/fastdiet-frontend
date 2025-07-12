import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ingredient } from '@/models/mealPlan';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import LabeledTextInput from '../forms/LabeledTextInput';
import FormLabel from '../forms/FormLabel';
import { useTranslation } from 'react-i18next';

interface Props {
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
}

const IngredientInputList = ({ ingredients, setIngredients }: Props) => {
  const { t } = useTranslation();

  const handleUpdate = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleAdd = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const handleRemove = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  return (
    <View style={styles.container}>
      {ingredients.map((ing, index) => (
        <View key={index} style={styles.ingredientRow}>
          <View style={{ flex: 3 }}>
            <LabeledTextInput
              label={t('myRecipes.form.ingredientName')}
              value={ing.name}
              onChangeText={(v) => handleUpdate(index, 'name', v)}
            />
          </View>
          <View style={{ flex: 1.5 }}>
            <LabeledTextInput
              label={t('myRecipes.form.quantity')}
              value={ing.quantity}
              onChangeText={(v) => handleUpdate(index, 'quantity', v)}
              keyboardType="numeric"
            />
          </View>
           <View style={{ flex: 1.5 }}>
            <LabeledTextInput
              label={t('myRecipes.form.unit')}
              value={ing.unit}
              onChangeText={(v) => handleUpdate(index, 'unit', v)}
            />
          </View>
          <TouchableOpacity onPress={() => handleRemove(index)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color={Colors.colors.gray[400]} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Ionicons name="add-circle-outline" size={24} color={Colors.colors.primary[200]} />
        <Text style={styles.addButtonText}>{t('myRecipes.form.addIngredient')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginBottom: 16,
    },
    deleteButton: {
        marginBottom: 8, // Alinear con la base de los inputs
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

export default IngredientInputList;