// React and Expo imports
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

// Components imports
import PaddingView from '@/components/views/PaddingView';
import TitleParagraph from '@/components/text/TitleParagraph';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import ViewForm from '@/components/views/ViewForm';
import ViewInputs from '@/components/views/ViewInputs';
import LabeledTextInput from '@/components/forms/LabeledTextInput';
import ImagePickerComponent from '@/components/recipe/ImagePickerComponent'; // NUEVO
import SectionHeader from '@/components/recipe/SectionHeader'; // NUEVO

// Hooks imports
import { useMyRecipes } from '@/hooks/useMyRecipes';
import { useValidations } from '@/hooks/useValidations'; // Asumo que tienes este hook
import { useFormValidation } from '@/hooks/useFormValidation'; // Asumo que tienes este hook

// Styles imports
import { Colors } from '@/constants/Colors';
import IngredientInputList from '@/components/recipe/IngredientInputList';
import StepInputList from '@/components/recipe/StepInputList';
import { RecipeInputIngredient, RecipeInputStep } from '@/models/recipeInput';


const CreateRecipeScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { createRecipe, loading } = useMyRecipes();
  const validations = useValidations();

  // Estados para el formulario de la receta
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState<RecipeInputIngredient[]>([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState<RecipeInputStep[]>([{ description: '' }]);
  
  // MEJORA: Hook de validación
  const { errors, validateForm } = useFormValidation({
    title: validations.required,
    prepTime: validations.positiveNumber,
    servings: validations.positiveNumber,
  });
  
  const handleSaveRecipe = async () => {
    // MEJORA: Validamos el formulario antes de enviar
    const isValid = validateForm({ title, prepTime, servings });
    if (!isValid) {
      Toast.show({ type: 'error', text1: 'Revisa los campos', text2: 'Algunos campos tienen errores o están vacíos.', position: 'bottom' });
      return;
    }

    // MEJORA: Transformamos los datos para la API
    const recipeData = {
      title,
      description,
      image_url: imageUri, // Opcional
      prep_time_min: parseInt(prepTime, 10) || undefined,
      servings: parseInt(servings, 10) || undefined,
      ingredients: ingredients
        .filter(i => i.name && i.quantity) // Ignoramos ingredientes vacíos
        .map(i => ({ ...i, quantity: parseFloat(i.quantity.replace(',', '.')) })),
      steps: steps.filter(s => s.description).map(s => s.description),
    };

    const { success, error } = await createRecipe(recipeData as any); // "as any" para que coincida con la firma del hook que creamos

    if (success) {
      Toast.show({ type: 'success', text1: t('myRecipes.create.success'), position: 'bottom' });
      router.back();
    } else {
      Toast.show({ type: 'error', text1: t('error'), text2: error, position: 'bottom' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.colors.neutral[100] }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <PaddingView>
              <ViewForm>
                <TitleParagraph
                  title={t('myRecipes.create.title')}
                  paragraph={t('myRecipes.create.subtitle')}
                />
                
                <ViewInputs>
                  {/* NUEVO: Componente para seleccionar imagen */}
                  <ImagePickerComponent imageUri={imageUri} onImagePicked={setImageUri} />
                  
                  <LabeledTextInput
                    label={t('myRecipes.form.title')}
                    value={title}
                    onChangeText={setTitle}
                    errorMessage={errors.title}
                  />
                  <LabeledTextInput
                    label={t('myRecipes.form.description')}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  <View style={styles.rowInputs}>
                     <View style={{flex: 1}}>
                        <LabeledTextInput
                            label={t('myRecipes.form.prepTime')}
                            keyboardType="numeric"
                            value={prepTime}
                            onChangeText={setPrepTime}
                            placeholder={t('myRecipes.form.minutes')}
                            errorMessage={errors.prepTime}
                        />
                     </View>
                     <View style={{flex: 1}}>
                        <LabeledTextInput
                            label={t('myRecipes.form.servings')}
                            keyboardType="numeric"
                            value={servings}
                            onChangeText={setServings}
                            errorMessage={errors.servings}
                        />
                     </View>
                  </View>
                  <SectionHeader title={t('myRecipes.form.ingredients')} iconName="basket-outline" />
                  <IngredientInputList ingredients={ingredients} setIngredients={setIngredients} />

                  <SectionHeader title={t('myRecipes.form.steps')} iconName="footsteps-outline" />
                  <StepInputList steps={steps} setSteps={setSteps} />

                </ViewInputs>
              </ViewForm>
            </PaddingView>
          </ScrollView>

          <View style={styles.fixedButtonContainer}>
            <PaddingView>
              <PrimaryButton
                title={t('saveRecipe')}
                style={{ width: "100%" }}
                onPress={handleSaveRecipe}
                loading={loading}
              />
            </PaddingView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 150, // Ajustamos el padding para el botón
    paddingTop: 16,
    backgroundColor: Colors.colors.neutral[100],
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.colors.neutral[100],
    paddingBottom: 24, // Damos más espacio abajo
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.colors.gray[200],
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  }
});

export default CreateRecipeScreen;