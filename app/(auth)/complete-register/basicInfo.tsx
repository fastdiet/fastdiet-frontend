// React & React Native Imports
import React, { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

// Component Imports
import PrimaryButton from "@/components/buttons/PrimaryButton";
import StyledTextInput from "@/components/forms/StyledTextInput";
import ErrorText from "@/components/text/ErrorText";
import TitleParagraph from "@/components/text/TitleParagraph";
import ViewForm from "@/components/views/ViewForm";
import ViewInputs from "@/components/views/ViewInputs";
import ViewContentContinue from "@/components/views/ViewForContinueButton";
import PaddingView from "@/components/views/PaddingView";

// Hook Imports
import { useAuth } from "@/hooks/useAuth";
import { useFormValidation } from "@/hooks/useFormValidation";

// Utility Imports
import { useValidations} from "@/utils/validations";
import { useTranslation } from "react-i18next";
import globalStyles from "@/styles/global";

export default function BasicInfoScreen() {
  const { completeBasicInfo } = useAuth();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const validations = useValidations();
  
  const { errors, validateForm } = useFormValidation({
    name: validations.name,
    username: validations.username,
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
    const isValid = validateForm({ name, username });
    if (!isValid) return;
    
    setLoading(true);
    const { success, error } = await completeBasicInfo(username, name);

    if (!success) {
      setErrorMessage(error);
      setLoading(false);
      return;
    }
    
    router.push("/complete-register/selectDiet")
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
      <View style={{ height: 16 }}></View>
      <PaddingView>
        <ViewContentContinue>
          <ViewForm>
            <TitleParagraph
              title={t("auth.completeRegister.basic.titleParagraph.title")}
              paragraph={t(
                "auth.completeRegister.basic.titleParagraph.paragraph"
              )}
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
            </ViewInputs>
          </ViewForm>
          <PrimaryButton
            title={t("continue")}
            onPress={handleSaveProfile}
            style={{ width: "100%" }}
            loading={loading}
          />
        </ViewContentContinue>
      </PaddingView>
    </View>
        </TouchableWithoutFeedback>
  );
  
}
