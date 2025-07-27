// React & React Native Imports
import { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

// Component Imports
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ErrorText from "@/components/text/ErrorText";
import TitleParagraph from "@/components/text/TitleParagraph";
import ViewInputs from "@/components/views/ViewInputs";
import PaddingView from "@/components/views/PaddingView";
import ViewContentContinue from "@/components/views/ViewForContinueButton";
import ViewForm from "@/components/views/ViewForm";
import PasswordInput from "@/components/forms/PasswordInput";

// Hook Imports
import { useFormValidation } from "@/hooks/useFormValidation";
import { useValidations } from "@/hooks/useValidations";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";



export default function ResetPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();
  const {resetPassword,} = useAuth();
  const validations = useValidations();
  
  useEffect(() => {
    Toast.show({type: "success", text1: "Código verificado", text2: "Establece tu nueva contraseña",});
  }, []);

  const { errors, validateForm } = useFormValidation({
    newPassword: validations.password,
    confirmPassword: (value: string) =>
      validations.passwordCheck(value, newPassword),
  });

  const handleResetPassword = async () => {
    setErrorMessage("");
    const isValid = validateForm({ newPassword, confirmPassword });
    if (!isValid) return;
    setLoading(true);
    const { success, error } = await resetPassword(newPassword,);

    if(!success){
      setErrorMessage(error?.message ?? "");
      setLoading(false);
      return
    }

    router.dismissAll();
    router.replace("/login")
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
      <View style={{ height: 16 }}></View>
      <PaddingView>
        <ViewContentContinue>
          <ViewForm>
            <TitleParagraph
              title={t("auth.resetPassword.titleParagraph.title")}
              paragraph={t("auth.resetPassword.titleParagraph.paragraph")}
            />

            {errorMessage && <ErrorText text={errorMessage} />}

            <ViewInputs>
              <PasswordInput
                placeholder={t("auth.resetPassword.newPassword")}
                value={newPassword}
                onChangeText={setNewPassword}
                errorMessage={errors.newPassword}
              />

              <PasswordInput
                placeholder={t("auth.resetPassword.confirmPassword")}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                errorMessage={errors.confirmPassword}
              />
            </ViewInputs>
          </ViewForm>

          <PrimaryButton
            title={t("auth.resetPassword.updatePassword")}
            onPress={handleResetPassword}
            style={{ width: "100%" }}
            loading={loading}
          />
        </ViewContentContinue>
      </PaddingView>
    </View>
    </TouchableWithoutFeedback>
  );
}