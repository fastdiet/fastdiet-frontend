// React & React Native Imports
import { useState } from "react";
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useRouter } from "expo-router";

// Component Imports
import PaddingView from "@/components/views/PaddingView";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import StyledTextInput from "@/components/forms/StyledTextInput";
import ErrorText from "@/components/text/ErrorText";
import TitleParagraph from "@/components/text/TitleParagraph";
import ViewContentContinue from "@/components/views/ViewForContinueButton";
import ViewForm from "@/components/views/ViewForm";

// Hook Imports
import { useFormValidation } from "@/hooks/useFormValidation";
import { useValidations } from "@/hooks/useValidations";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

// Style Imports
import globalStyles from "@/styles/global";



export default function SendPasswordResetCodeScreen() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { sendPasswordResetCode } = useAuth();
  const { t } = useTranslation();
  const validations = useValidations();
  const { errors, validateForm } = useFormValidation({
    email: validations.email,
  });

  const handleRequestCode = async () => {
    setErrorMessage("");
    const isValid = validateForm({ email: emailInput });

    if (!isValid) return;
    
    setLoading(true);
    const { success, error } = await sendPasswordResetCode(emailInput,);

    if(!success){
      setErrorMessage(error);
      setLoading(false);
      return;
    }
    router.push("/verifyPasswordReset");
  };

  return <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
      <View style={{ height: 16 }}></View>
      <PaddingView>
        <ViewContentContinue>
          <ViewForm>
            <TitleParagraph
              title={t("auth.sendPasswordReset.titleParagraph.title")}
              paragraph={t("auth.sendPasswordReset.titleParagraph.paragraph")}
            />

            {errorMessage ? <ErrorText text={errorMessage} /> : null}

            <StyledTextInput
              style={globalStyles.largeBodyMedium}
              placeholder={t("auth.sendPasswordReset.email")}
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailInput}
              onChangeText={setEmailInput}
              errorMessage={errors.email}
            />
            <TouchableOpacity onPress={() => {
              router.dismissAll();
              router.replace("/login")}
              }>
              <Text
                style={[
                  globalStyles.mediumBodyMedium,
                  {
                    textAlign: "center",
                    marginTop: 16,
                    marginBottom: 16,
                  },
                ]}
              >
                {t("auth.sendPasswordReset.backToLogin")}
              </Text>
            </TouchableOpacity>
          </ViewForm>

          <PrimaryButton
            title={t("auth.sendPasswordReset.sendCode")}
            onPress={handleRequestCode}
            style={{ width: "100%" }}
            loading={loading}
          />
        </ViewContentContinue>
      </PaddingView>
    </View>
    </TouchableWithoutFeedback>
}
