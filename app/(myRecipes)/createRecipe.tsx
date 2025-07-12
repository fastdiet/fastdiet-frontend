import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
// Componentes que ya tienes
import LabeledTextInput from '@/components/forms/LabeledTextInput';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import ViewForm from '@/components/views/ViewForm';
import PaddingView from '@/components/views/PaddingView';
//import ImagePickerButton from '@/components/forms/ImagePickerButton'; // Componente a crear

export default function CreateRecipeScreen() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  // ... más estados

  return (
    <ScrollView style={styles.container}>
      <PaddingView>
        <ViewForm>
          {/* Componente para seleccionar imagen */}
            {/* <ImagePickerButton onImageSelected={(image) => setImage(image)} /> */}

          <LabeledTextInput
            label={t('recipes.form.title')}
            value={title}
            onChangeText={setTitle}
          />
          <LabeledTextInput
            label={t('recipes.form.description')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
          <LabeledTextInput
            label={t('recipes.form.ingredients')}
            placeholder={t('recipes.form.ingredientsPlaceholder')}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            numberOfLines={8}
            style={{ height: 180, textAlignVertical: 'top' }}
          />
          <LabeledTextInput
            label={t('recipes.form.instructions')}
            placeholder={t('recipes.form.instructionsPlaceholder')}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={10}
            style={{ height: 220, textAlignVertical: 'top' }}
          />
          
          <PrimaryButton title={t('recipes.form.saveButton')} onPress={() => {}} />
        </ViewForm>
      </PaddingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});