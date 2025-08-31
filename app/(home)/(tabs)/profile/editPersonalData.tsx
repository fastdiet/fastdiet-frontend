/// React & React Native Imports
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

// Component Imports
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ErrorText from "@/components/text/ErrorText";
import TitleParagraph from "@/components/text/TitleParagraph";
import PaddingView from "@/components/views/PaddingView";
import CustomRadioGroup from "@/components/forms/CustomRadioGroup";
import ViewInputs from "@/components/views/ViewInputs";
import ViewForm from "@/components/views/ViewForm";
import LabeledTextInput from "@/components/forms/LabeledTextInput";
import FormLabel from "@/components/forms/FormLabel";

// Hook Imports
import { useAuth } from "@/hooks/useAuth";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useValidations } from "@/hooks/useValidations";
import { useTranslation } from "react-i18next";

// Style Imports
import { Colors } from "@/constants/Colors";
import { getGenderOptions } from "@/constants/genders";

export default function EditPersonalDataScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { user, completeBasicInfo } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name || "");
  const [selectedGender, setSelectedGender] = useState(user?.gender || "");
  const [age, setAge] = useState(user?.age?.toString() || "");
  const [weight, setWeight] = useState(user?.weight?.toString() || "");
  const [height, setHeight] = useState(user?.height?.toString() || "");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const validations = useValidations();

  const genderOptions = getGenderOptions(t);
  
  const { errors, validateForm } = useFormValidation({
    name: validations.name,
    username: validations.username,
    gender: validations.gender,
    age: validations.age,
    weight: validations.weight,
    height: validations.height,
  });

  const handleSave = async () => {
    setErrorMessage("");
    const isValid = validateForm({ name, username, gender: selectedGender, age, weight, height });
    if (!isValid) return;
    
    setLoading(true);
    const { success, error } = await completeBasicInfo(
      username,
      name, 
      selectedGender, 
      parseInt(age), 
      parseFloat(weight), 
      parseFloat(height)
    );

    setLoading(false);

    if (success) {
      Toast.show({type: 'success', text1: t('profile.personalDataUpdated'),});
      router.back();
    } else {
      setErrorMessage(error?.message ?? "");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ height: 16 }} />
          <PaddingView>
            <ViewForm>
              <TitleParagraph
                title={t("profile.edit.personalData.title")}
                paragraph={t("profile.edit.personalData.paragraph")}
              />
              {errorMessage ? <ErrorText text={errorMessage} /> : null}

              <ViewInputs>
                <LabeledTextInput
                  label={t("auth.completeRegister.basic.name")}
                  value={name}
                  onChangeText={setName}
                  errorMessage={errors.name}
                />
                <LabeledTextInput
                  label={t("auth.completeRegister.basic.username")}
                  value={username}
                  onChangeText={(text) => setUsername(text.toLowerCase())}
                  errorMessage={errors.username}
                  autoCapitalize="none"
                />
                <View style={{ width: '100%'}}>
                  <FormLabel text={t("auth.completeRegister.basic.gender")} />
                  <CustomRadioGroup
                    options={genderOptions}
                    layout="row"
                    onValueChange={setSelectedGender}
                    selectedValue={selectedGender}
                    errorMessage={errors.gender}
                  />
                </View>
                <LabeledTextInput
                  label={t("auth.completeRegister.basic.age")}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                  errorMessage={errors.age}
                />
                <LabeledTextInput
                  label={t("auth.completeRegister.basic.weight")}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  errorMessage={errors.weight}
                />
                <LabeledTextInput
                  label={t("auth.completeRegister.basic.height")}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                  errorMessage={errors.height}
                />
              </ViewInputs>
            </ViewForm>
          </PaddingView>
        </ScrollView>

        <View style={styles.fixedButton}>
          <PaddingView>
            <PrimaryButton
              title={t("save")}
              onPress={handleSave}
              style={{ width: "100%" }}
              loading={loading}
            />
          </PaddingView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  fixedButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.colors.neutral[100],
    paddingVertical: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.colors.gray[200],
  },
});
