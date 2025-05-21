// React & React Native Imports
import React, { useEffect, useMemo, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

// Component Imports
import PrimaryButton from "@/components/buttons/PrimaryButton";
import StyledTextInput from "@/components/forms/StyledTextInput";
import ErrorText from "@/components/text/ErrorText";
import TitleParagraph from "@/components/text/TitleParagraph";
import PaddingView from "@/components/views/PaddingView";
import ViewContentContinue from "@/components/views/ViewForContinueButton";

// Hook Imports
import { useAuth } from "@/hooks/useAuth";
import { useFormValidation } from "@/hooks/useFormValidation";

// Utility Imports
import { useValidations} from "@/utils/validations";
import { useTranslation } from "react-i18next";
import globalStyles from "@/styles/global";
import CustomRadioGroup from "@/components/forms/CustomRadioGroup";
import ViewInputs from "@/components/views/ViewInputs";
import ViewForm from "@/components/views/ViewForm";
import { Colors } from "@/constants/Colors";

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
  const genderOptions = useMemo(() => ([
    {
      id: '1',
      label: t("male"),
      value: 'male',
    },
    {
      id: '2',
      label: t("female"),
      value: 'female',
    },
  ]), []);

  
  const { errors, validateForm } = useFormValidation({
    name: validations.name,
    username: validations.username,
    gender: validations.gender,
    age: validations.age,
    weight: validations.weight,
    height: validations.height,
  });
  useEffect(() => {
    Toast.show({
      type: "success",
      text1: "Email verificado",
      text2: "Completa tu perfil",
      position: "bottom",
      bottomOffset: 80,
    });
  }, []);

  const handleSaveProfile = async () => {
    setErrorMessage("");
    console.log("gender", selectedGender);
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
      setErrorMessage(error);
      setLoading(false);
      return;
    }
    
    router.push("/complete-register/selectActivity");
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
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
                    onChangeText={setUsername}
                    placeholder={t("auth.completeRegister.basic.username")}
                    errorMessage={errors.username}
                  />
                  <CustomRadioGroup
                    radioButtons={genderOptions}
                    layout="row"
                    onPress={setSelectedGender}
                    selectedId={selectedGender}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120, // deja espacio para que no tape el botón
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
