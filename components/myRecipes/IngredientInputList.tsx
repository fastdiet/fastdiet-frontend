import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FormInputIngredient } from '@/models/recipeInput';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import LabeledTextInput from '@/components/forms/LabeledTextInput';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid/non-secure';
import { PlusCircle, Trash2 } from 'lucide-react-native';

interface Props {
  ingredients: FormInputIngredient[];
  setIngredients: (ingredients: FormInputIngredient[]) => void;
}

const IngredientInputList = ({ ingredients, setIngredients }: Props) => {
  const { t } = useTranslation();

  
  const handleAddIngredient = () => {
    setIngredients([...ingredients, {id: nanoid(), name: '', amount: '', unit: '' }]);
  };

  const handleUpdateIngredient = (id: string, field: keyof FormInputIngredient, value: string) => {
    const updatedIngredients = ingredients.map(ingredient =>
      ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updatedIngredients);
  };

  const handleRemoveIngredient = (id: string) => {
    const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== id);
    setIngredients(updatedIngredients);
  };

  return (
    <View style={[styles.container, ingredients.length != 0 ? { marginTop: 8 } : {}]}>
      {ingredients.map((ing, index) => (
        <View key={ing.id} style={styles.ingredientRow}>
          <View style={{ flex: 3 }}>
            <LabeledTextInput
              label={t('myRecipes.form.ingredientName')}
              value={ing.name}
              onChangeText={(v) => handleUpdateIngredient(ing.id, 'name', v)}
            />
          </View>
          <View style={{ flex: 1.5 }}>
            <LabeledTextInput
              label={t('myRecipes.form.amount')}
              value={ing.amount}
              onChangeText={(v) => handleUpdateIngredient(ing.id, 'amount', v)}
              keyboardType="numeric"
            />
          </View>
           <View style={{ flex: 1.5 }}>
            <LabeledTextInput
              label={t('myRecipes.form.unit')}
              value={ing.unit}
              placeholder='g, ml...'
              autoCapitalize="none"
              onChangeText={(v) => handleUpdateIngredient(ing.id, 'unit', v)}
            />
          </View>
          <TouchableOpacity onPress={() => handleRemoveIngredient(ing.id)} style={styles.deleteButton}>
            <Trash2 size={24}  strokeWidth={1.5} color={Colors.colors.gray[400]} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
        <PlusCircle size={22} strokeWidth={1.8} color={Colors.colors.primary[100]} />
        <Text style={styles.addButtonText}>{t('myRecipes.form.addIngredient')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%',},
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 10,
  },
  deleteButton: {
    marginBottom: 8,
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

export default IngredientInputList;