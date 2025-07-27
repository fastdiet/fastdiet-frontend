// React & React Native Imports
import { useState } from "react";
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


export default function ChangePasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { changePassword } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const validations = useValidations();

  const { errors, validateForm } = useFormValidation({
    currentPassword: validations.password,
    newPassword: validations.password,
    confirmPassword: (value: string) => validations.passwordCheck(value, newPassword),
  });
  
  const handleChangePassword = async () => {
    setErrorMessage("");
    const isValid = validateForm({ currentPassword, newPassword, confirmPassword });
    if (!isValid) return;

    setLoading(true);
    const { success, error } = await changePassword(currentPassword, newPassword);

    setLoading(false);

    if (success) {
      Toast.show({ type: 'success', text1: t('profile.passwordUpdated') });
      router.back();
    } else {
      setErrorMessage(error?.message ?? "");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <View style={{ height: 16 }} />
        <PaddingView>
          <ViewContentContinue>
            <ViewForm>
              <TitleParagraph
                title={t("profile.edit.changePassword.title")}
                paragraph={t("profile.edit.changePassword.paragraph")}
              />

              {errorMessage && <ErrorText text={errorMessage} />}

              <ViewInputs>
                <PasswordInput
                  placeholder={t("profile.edit.changePassword.currentPassword")}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  errorMessage={errors.currentPassword}
                />
                <PasswordInput
                  placeholder={t("profile.edit.changePassword.newPassword")}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  errorMessage={errors.newPassword}
                />
                <PasswordInput
                  placeholder={t("profile.edit.changePassword.confirmPassword")}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  errorMessage={errors.confirmPassword}
                />
              </ViewInputs>
            </ViewForm>

            <PrimaryButton
              title={t("save")}
              onPress={handleChangePassword}
              style={{ width: "100%" }}
              loading={loading}
            />
          </ViewContentContinue>
        </PaddingView>
      </View>
    </TouchableWithoutFeedback>
  );
}