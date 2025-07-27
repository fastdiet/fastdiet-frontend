// React and Expo imports
import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { nanoid } from 'nanoid/non-secure';

// Components imports
import PaddingView from '@/components/views/PaddingView';
import TitleParagraph from '@/components/text/TitleParagraph';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import ViewForm from '@/components/views/ViewForm';
import ViewInputs from '@/components/views/ViewInputs';
import LabeledTextInput from '@/components/forms/LabeledTextInput';
import ImagePickerComponent from '@/components/myRecipes/ImagePickerComponent';
import SectionHeader from '@/components/myRecipes/SectionHeader'
import ErrorText from '@/components/text/ErrorText';
import IngredientInputList from '@/components/myRecipes/IngredientInputList';
import StepInputList from '@/components/myRecipes/StepInputList';

// Hooks imports
import { useMyRecipes } from '@/hooks/useMyRecipes';
import { useValidations } from '@/hooks/useValidations';
import { useFormValidation } from '@/hooks/useFormValidation';

// Styles imports
import { Colors } from '@/constants/Colors';

// Models imports
import { FormInputIngredient, FormInputStep, RecipeCreationData } from '@/models/recipeInput';
import { ChefHat, List, Utensils } from 'lucide-react-native';
import CustomRadioGroup from '@/components/forms/CustomRadioGroup';
import { getDishTypesOptions } from '@/constants/dishTypes';


const CreateRecipeScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { createRecipe } = useMyRecipes();
  const validations = useValidations();
  const [loading, setLoading] = useState(false);

  const dishTypeOptions = getDishTypesOptions(t);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    readyMin: '',
    servings: '', 
    imageUri: null as string | null,
    dishTypes: [] as string[],
    ingredients: [{id: nanoid(), name: '', amount: '', unit: '' }] as FormInputIngredient[],
    steps: [{ id: nanoid(), description: '' }] as FormInputStep[],
  });

  const handleDishTypeChange = (value: string) => {
    setFormData(prev => {
      const newDishTypes = [...prev.dishTypes];
      const index = newDishTypes.indexOf(value);

      if (index > -1) {
        newDishTypes.splice(index, 1);
      } else {
        newDishTypes.push(value);
      }
      return { ...prev, dishTypes: newDishTypes };
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const { errors, validateForm } = useFormValidation({
    title: validations.titleRecipe,
    readyMin: validations.requiredPositiveNumber,
    servings: validations.requiredPositiveNumber,
    dishTypes: validations.atLeastOneSelected,
    ingredients: validations.ingredientsList,
  });
  
  const handleSaveRecipe = async () => {
   const isValid = validateForm(formData);
    if (!isValid) {
      Toast.show({ type: 'error', text1: 'Revisa el formulario', text2: 'Algunos campos tienen errores.'});
      return;
    }

    // 1. Lógica de subida de imagen (a futuro)
    // setLoading(true); // Activar el loading ANTES de cualquier operación async
    // let finalImageUrl = null;
    // try {
    //   if (formData.imageUri) {
    //     // y devuelve la URL pública.
    //     finalImageUrl = await uploadImage(formData.imageUri);
    //   }
    // } catch (uploadError) {
    //   setLoading(false);
    //   Toast.show({ type: 'error', text1: 'Error al subir la imagen' });
    //   return;
    // }

    setLoading(true);
    const validIngredients = formData.ingredients.filter(ing => ing.name.trim() && ing.amount.trim());
    const validSteps = formData.steps.filter(s => s.description.trim());
    const recipeData: RecipeCreationData = {
      title: formData.title.trim(),
      summary: formData.summary.trim() || undefined,
      ready_min: formData.readyMin ? parseInt(formData.readyMin, 10) : undefined,
      servings: formData.servings ? parseInt(formData.servings, 10) : undefined,
      dish_types: formData.dishTypes.length > 0 ? formData.dishTypes : undefined,
      ingredients: validIngredients.map(ing => ({
        name: ing.name.trim(),
        amount: ing.amount ? parseFloat(ing.amount.replace(',', '.')) : 0,
        unit: ing.unit ? ing.unit.trim() : undefined,
      })),
      image_url: formData.imageUri || null,
      analyzed_instructions: validSteps.map((s, index) => ({
        number: index + 1,
        step: s.description.trim(),
        ingredients: [],
        equipment: [],
      }))
    };
    const { success, error } = await createRecipe(recipeData);

    if (success) {
      Toast.show({ type: 'success', text1: t('myRecipes.create.success')});
      router.replace('/my-recipes');
    } else {
      setLoading(false);
      Toast.show({ type: 'error', text1: t('error'), text2: error?.message ?? ""});
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.colors.neutral[100] }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingTop: 16, paddingBottom: 150 }}
            keyboardShouldPersistTaps="handled"
          >
            <PaddingView>
              <ViewForm>
                <TitleParagraph
                  title={t('myRecipes.create.title')}
                  paragraph={t('myRecipes.create.subtitle')}
                />
                
                <ViewInputs>
                  <ImagePickerComponent 
                    imageUri={formData.imageUri} 
                    onImagePicked={(uri) => handleInputChange('imageUri', uri)} 
                  />

                  <LabeledTextInput
                    label={t('myRecipes.form.title')}
                     value={formData.title}
                    onChangeText={(text) => handleInputChange('title', text)}
                    errorMessage={errors.title}
                  />
                  <LabeledTextInput
                    label={t('myRecipes.form.description')}
                    value={formData.summary}
                    onChangeText={(text) => handleInputChange('summary', text)}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  <View style={styles.rowInputs}>
                     <View style={{flex: 1}}>
                        <LabeledTextInput
                            label={t('myRecipes.form.prepTime')}
                            keyboardType="numeric"
                            value={formData.readyMin}
                            onChangeText={(text) => handleInputChange('readyMin', text)}
                            placeholder={t('myRecipes.form.minutes')}
                            errorMessage={errors.readyMin}
                        />
                     </View>
                     <View style={{flex: 1}}>
                        <LabeledTextInput
                            label={t('myRecipes.form.servings')}
                            keyboardType="numeric"
                            value={formData.servings}
                            onChangeText={(text) => handleInputChange('servings', text)}
                            errorMessage={errors.servings}
                        />
                     </View>
                  </View>
                  <SectionHeader title={t('recipes.myRecipes.mealType')} iconComponent={Utensils} />
                  <CustomRadioGroup
                    options={dishTypeOptions}
                    onValueChange={handleDishTypeChange}
                    selectedValue={formData.dishTypes}
                    mode="multiple"
                    layout="row"
                    errorMessage={errors.dishTypes}
                  />
                 
                  <SectionHeader title={t('myRecipes.form.ingredients')} iconComponent={List} />
                  {errors.ingredients && <ErrorText text={errors.ingredients} />}
                  <IngredientInputList 
                    ingredients={formData.ingredients} 
                    setIngredients={(ings) => handleInputChange('ingredients', ings)}
                  />

                  <SectionHeader title={t('myRecipes.form.steps')} iconComponent={ChefHat} />
                  {errors.steps && <ErrorText text={errors.steps} />}
                  <StepInputList 
                    steps={formData.steps} 
                    setSteps={(steps) => handleInputChange('steps', steps)}
                  /> 

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.colors.neutral[100],
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