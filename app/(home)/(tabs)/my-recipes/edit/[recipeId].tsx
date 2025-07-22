// React and Expo imports
import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Text } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
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
import { useRecipe } from '@/hooks/useRecipe'; // ¡NUEVO! Para cargar la receta existente.
import { useValidations } from '@/hooks/useValidations';
import { useFormValidation } from '@/hooks/useFormValidation';

// Styles imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

// Models imports
import { FormInputIngredient, FormInputStep, RecipeCreationData } from '@/models/recipeInput';
import { AlertCircle, ChefHat, List } from 'lucide-react-native';
import RecipePageStatus from '@/components/recipeDetails/RecipePageStatus';


const EditRecipeScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { recipeId } = useLocalSearchParams();
  const id = Number(recipeId);
  const { recipe, loading, error, refetch } = useRecipe(id);
  const { updateRecipe } = useMyRecipes();
  const validations = useValidations();
  
  const [isUpdating, setIsUpdating] = useState(false);
  
   const [formData, setFormData] = useState({
    title: '',
    summary: '',
    readyMin: '',
    servings: '', 
    imageUri: null as string | null,
    ingredients: [] as FormInputIngredient[],
    steps: [] as FormInputStep[],
  });

  useEffect(() => {
    if (recipe) {
      const mappedIngredients = recipe.ingredients?.map(ing => ({
        id: nanoid(),
        name: ing.ingredient.name,
        amount: ing.amount.toString(),
        unit: ing.unit || '',
      })) ?? [];
      
      const mappedSteps = recipe.analyzed_instructions?.[0]?.steps.map(step => ({
        id: nanoid(),
        description: step.step,
      })) ?? [];

      setFormData({
        title: recipe.title,
        summary: recipe.summary || '',
        readyMin: recipe.ready_min?.toString() || '',
        servings: recipe.servings?.toString() || '',
        imageUri: recipe.image_url || null,
        ingredients: mappedIngredients.length > 0 ? mappedIngredients : [{ id: nanoid(), name: '', amount: '', unit: '' }],
        steps: mappedSteps.length > 0 ? mappedSteps : [{ id: nanoid(), description: '' }],
      });
    }
  }, [recipe]);


  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const { errors, validateForm } = useFormValidation({
    title: validations.titleRecipe,
    readyMin: validations.requiredPositiveNumber,
    servings: validations.requiredPositiveNumber,
    ingredients: validations.ingredientsList,
  });
  
  const handleUpdateRecipe = async () => {
    if (!recipeId) return;

    const isValid = validateForm(formData);
    if (!isValid) {
      Toast.show({ type: 'error', text1: 'Revisa el formulario', text2: 'Algunos campos tienen errores.'});
      return;
    }

    setIsUpdating(true);
    const validIngredients = formData.ingredients.filter(ing => ing.name.trim() && ing.amount.trim());
    const validSteps = formData.steps.filter(s => s.description.trim());

    const recipeData: RecipeCreationData = {
      title: formData.title.trim(),
      summary: formData.summary.trim() || undefined,
      ready_min: formData.readyMin ? parseInt(formData.readyMin, 10) : undefined,
      servings: formData.servings ? parseInt(formData.servings, 10) : undefined,
      ingredients: validIngredients.map(ing => ({
        name: ing.name.trim(),
        amount: ing.amount ? parseFloat(ing.amount.replace(',', '.')) : 0,
        unit: ing.unit ? ing.unit.trim() : undefined,
      })),
      image_url: formData.imageUri || null,
      analyzed_instructions: validSteps.length > 0 ? validSteps.map((s, index) => ({
        number: index + 1,
        step: s.description.trim(),
        ingredients: [],
        equipment: [],
      })) : undefined,
    };

    const { success, error } = await updateRecipe(id, recipeData);

    if (success) {
      Toast.show({ type: 'success', text1: t('myRecipes.edit.success')});
      router.back();
    } else {
      setIsUpdating(false);
      Toast.show({ type: 'error', text1: t('error'), text2: error?.message ?? ""});
    }
  };

   if (loading && !recipe) {
    return <RecipePageStatus status="loading" />;
  }

  if (error || !recipe) {
    return (
      <RecipePageStatus 
        status="error"
        errorDetails={{
          errorTitle: t("myRecipes.detail.notFound"),
          errorMessage: error,
          notFoundTitle: t("myRecipes.detail.notFoundTitle"),
          onRetry: refetch
        }}
      />
    );
  }

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
                  title={t('myRecipes.edit.title')}
                  paragraph={t('myRecipes.edit.subtitle')}
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
                title={t('updateRecipe')}
                style={{ width: "100%" }}
                onPress={handleUpdateRecipe}
                loading={isUpdating}
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
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.colors.gray[100],
  },
  messageText: {
    marginTop: 10,
    color: "#333",
  },
   errorTitle: {
    marginTop: 16,
    textAlign: 'center',
    ...globalStyles.headlineSmall,
    color: Colors.colors.gray[900],
  },
  errorMessage: {
    marginVertical: 8,
    textAlign: 'center',
    ...globalStyles.largeBody,
    color: Colors.colors.gray[500],
    lineHeight: 22,
  },
});

export default EditRecipeScreen;