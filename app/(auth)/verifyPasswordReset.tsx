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

export default function VerifyPasswordResetScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {verifyPasswordResetCode, sendPasswordResetCode, emailReset } = useAuth();
  
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
    router.push("/resetPassword");
    
  };

  const handleResendCode = async () => {
    if (resendLoading) return;
    setResendLoading(true);

    const { success, error } = await sendPasswordResetCode(emailReset);
    if (success) {
      Toast.show({type: "success", text1: "Código reenviado", text2: "Se ha enviado un nuevo código a tu correo.",});
    } else {
      Toast.show({type: "error", text1: "Error", text2: error?.message ?? "",});
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