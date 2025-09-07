// React and Expo Imports
import { useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

// Components imports
import ConfirmationCodeForm from "@/components/forms/ConfirmationCodeForm";

// Hooks imports
import {useFormValidation} from "@/hooks/useFormValidation";
import { useValidations } from "@/hooks/useValidations";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function VerifyPasswordResetScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {verifyPasswordResetCode, sendPasswordResetCode, emailReset } = useAuth();
  const { t } =  useTranslation();
  const validations = useValidations();
  const { errors, validateForm } = useFormValidation({
    code: validations.confirmationCode,
  });

  const handleVerifyCode = async (code : string) => {
    setErrorMessage("");
    const isValid = validateForm({ code });
    if (!isValid) return;
    setLoading(true);
    const { success, error } = await verifyPasswordResetCode(code);
    
    if(!success){
      setErrorMessage(error?.message ?? "");
      setLoading(false);
      return;
    }
    
    Toast.show({type: "success", text1: t("auth.verifyCode.codeVerified"), text2: t("auth.verifyCode.establishNewPassword"),});
    router.replace("/resetPassword");
    
  };

  const handleResendCode = async () => {
    if (resendLoading) return;
    setResendLoading(true);

    const { success, error } = await sendPasswordResetCode(emailReset);
    if (success) {
      Toast.show({type: "success", text1: t("auth.verifyCode.codeResent"), text2: t("auth.verifyCode.codeResentDescription"),});
    } else {
      Toast.show({type: "error", text1: t("error"), text2: error?.message ?? "",});
    }
    setResendLoading(false);
  };

  return (
    <ConfirmationCodeForm
      onSubmit={handleVerifyCode}
      onResend={handleResendCode}
      loading={loading}
      resendLoading={resendLoading}
      errorMessage={errorMessage}
      codeError={errors.code}
      email={emailReset}
    />
  );
}