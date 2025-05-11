import i18n from "@/i18n";
import axios from "axios";

export const handleApiError = ( error: unknown, defaultMessageKey: string = "errorsBackend.genericError") => {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.detail || error.response?.data?.message;

    if (backendMessage) {
      return getFrontendErrorMessage(backendMessage);
    }
  }

  return i18n.t(defaultMessageKey);
};


const backendToFrontendErrorMap: { [key: string]: string } = {
  "Incorrect username or password": "errorsBackend.invalidCredentials",
  "User not verified": "errorsBackend.userNotVerified",
  "Email already registered": "errorsBackend.emailAlreadyRegistered",
  "User not found": "errorsBackend.userNotFound",
  "User already verified": "errorsBackend.userAlreadyVerified",
  "Email not valid": "errorsBackend.invalidEmail",
  "Error sending email": "errorsBackend.emailSendError",
  "Invalid or expired refresh token": "errorsBackend.invalidRefreshToken",
  "Invalid token": "errorsBackend.invalidToken",
  "You need to verify your email before resetting the password":
    "errorsBackend.verifyEmailBeforeReset",
  "Invalid or expired reset code": "errorsBackend.invalidResetCode",
  "Invalid or expired code": "errorsBackend.invalidCode",
  "Username already exists": "errorsBackend.usernameExists",
  "Diet type not found": "errorsBackend.dietTypeNotFound",
  "Cuisine regions not found": "errorsBackend.cuisineRegionsNotFound",
};

export const getFrontendErrorMessage = (backendMessage: string): string => {
  const translationKey = backendToFrontendErrorMap[backendMessage] || "errors.genericError";
  return i18n.t(translationKey);
};