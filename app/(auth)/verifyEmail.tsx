// React & React Native Imports
import { useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

// Component Imports
import ConfirmationCodeForm from "@/components/forms/ConfirmationCodeForm";

// Hook Imports
import { useFormValidation } from "@/hooks/useFormValidation";
import { useValidations } from "@/hooks/useValidations";
import { useAuth } from "@/hooks/useAuth";


export default function VerifyEmailScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, verifyEmail, sendVerificationCode } = useAuth();
  const validations = useValidations();
  const { errors, validateForm } = useFormValidation({
    code: validations.confirmationCode,
  });

  const handleVerifyCode = async (code: string) => {
    setErrorMessage("");

    const isValid = validateForm({ code });
    if (!isValid) return;
    setLoading(true);
    const { success, error } = await verifyEmail(code);

    if (!success) {
      setErrorMessage(error?.message ?? "");
      setLoading(false);
      return;
    } 
    router.replace("/complete-register/basicInfo");
  };

  const handleResendCode = async () => {
    if (resendLoading) return;
    setResendLoading(true);

    const { success, error } = await sendVerificationCode(user!.email!);
    if (success) {
      Toast.show({type: "success", text1: "Código enviado", text2: "Se ha enviado un nuevo código de verificación a tu correo.",});
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
      email={user!.email!}
    />
  );
}
