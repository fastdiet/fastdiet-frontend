// React & React Native Imports
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

// Component Imports
import PrimaryButton from "@/components/buttons/PrimaryButton";
import StyledTextInput from "@/components/forms/StyledTextInput";
import ErrorText from "@/components/text/ErrorText";
import TitleParagraph from "@/components/text/TitleParagraph";
import PaddingView from "@/components/views/PaddingView";
import CustomRadioGroup from "@/components/forms/CustomRadioGroup";
import ViewInputs from "@/components/views/ViewInputs";
import ViewForm from "@/components/views/ViewForm";

// Hook Imports
import { useAuth } from "@/hooks/useAuth";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useValidations } from "@/hooks/useValidations";
import { useTranslation } from "react-i18next";

// Style Imports
import globalStyles from "@/styles/global";
import { Colors } from "@/constants/Colors";
import { getGenderOptions } from "@/constants/genders";

export default function BasicInfoScreen() {
  const { completeBasicInfo } = useAuth();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { t } = useTranslation();
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
  //TODO TOAST
  useEffect(() => {
    Toast.show({ type: "success", text1: "Email verificado", text2: "Completa tu perfil",});
  }, []);

  const handleSaveProfile = async () => {
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

    if (!success) {
      setErrorMessage(error?.message ?? "");
      setLoading(false);
      return;
    }
    
    router.push("/complete-register/selectActivity");
    setLoading(false);
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
                  title={t("auth.completeRegister.basic.titleParagraph.title")}
                  paragraph={t("auth.completeRegister.basic.titleParagraph.paragraph")}
                />
                {errorMessage ? <ErrorText text={errorMessage} /> : null}

                <ViewInputs>
                  <StyledTextInput
                    style={globalStyles.largeBodyMedium}
                    placeholder={t("auth.completeRegister.basic.name")}
                    value={name}
                    onChangeText={setName}
                    errorMessage={errors.name}
                  />
                  <StyledTextInput
                    style={globalStyles.largeBodyMedium}
                    value={username}
                    autoCapitalize="none"
                    onChangeText={(text) => setUsername(text.toLowerCase())}
                    placeholder={t("auth.completeRegister.basic.username")}
                    errorMessage={errors.username}
                  />
                  <CustomRadioGroup
                    options={genderOptions}
                    layout="row"
                    onValueChange={setSelectedGender}
                    selectedValue={selectedGender}
                    errorMessage={errors.gender}
                  />
                  <StyledTextInput
                    style={globalStyles.largeBodyMedium}
                    placeholder={t("auth.completeRegister.basic.age")}
                    keyboardType="numeric"
                    value={age}
                    onChangeText={setAge}
                    errorMessage={errors.age}
                  />
                  <StyledTextInput
                    style={globalStyles.largeBodyMedium}
                    placeholder={t("auth.completeRegister.basic.weight")}
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                    errorMessage={errors.weight}
                  />
                  <StyledTextInput
                    style={globalStyles.largeBodyMedium}
                    placeholder={t("auth.completeRegister.basic.height")}
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
                title={t("continue")}
                onPress={handleSaveProfile}
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
