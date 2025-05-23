import { useTranslation } from "react-i18next";
import validate from "react-native-email-validator";

export const useValidations = () => {
  const { t } = useTranslation();
  return {
    username: (value: string) => {
      if (!value.trim())
        return t("errorsFrontend.validations.usernameRequired");
      if (value.length < 3 || value.length > 20)
        return t("errorsFrontend.validations.usernameLength");
      if (value.includes(" "))
        return t("errorsFrontend.validations.usernameNoSpaces");
      if (!/^[a-zA-Z0-9_.-]+$/.test(value))
        return t("errorsFrontend.validations.usernameInvalidChars");
      return null;
    },
    email: (value: string) => {
      if (!value.trim()) return t("errorsFrontend.validations.emailRequired");
      if (!validate(value)) return t("errorsFrontend.validations.emailInvalid");
      return null;
    },
    password: (value: string) => {
      if (!value.trim())
        return t("errorsFrontend.validations.passwordRequired");
      if (value.length < 8)
        return t("errorsFrontend.validations.passwordMinLength");
      if (!/[A-Z]/.test(value))
        return t("errorsFrontend.validations.passwordUppercase");
      if (!/[a-z]/.test(value))
        return t("errorsFrontend.validations.passwordLowercase");
      if (!/[0-9]/.test(value))
        return t("errorsFrontend.validations.passwordDigit");
      if (!/[^A-Za-z0-9]/.test(value))
        return t("errorsFrontend.validations.passwordSpecialChar");
      return null;
    },
    passwordCheck: (value: string, compareValue: string) => {
      if (!value.trim())
        return t("errorsFrontend.validations.passwordCheckRequired");
      if (value !== compareValue)
        return t("errorsFrontend.validations.passwordsDontMatch");
      return null;
    },
    confirmationCode: (value: string) => {
      if (!value.trim())
        return t("errorsFrontend.validations.confirmationCodeRequired");
      if (!/^\d{6}$/.test(value))
        return t("errorsFrontend.validations.confirmationCodeInvalid");
      return null;
    },
    name: (value: string) => {
      if (!value.trim()) return t("errorsFrontend.validations.nameRequired");
      if (value.length < 3 || value.length > 20)
        return t("errorsFrontend.validations.nameLength");
      return null;
    },
    age: (value: string) => {
      const numeric = parseInt(value, 10);
      if (!value.trim()) return t("errorsFrontend.validations.ageRequired");
      if (isNaN(numeric) || numeric < 1 || numeric > 120)
        return t("errorsFrontend.validations.ageInvalid");
      return null;
    },
    weight: (value: string) => {
      const numeric = parseFloat(value);
      if (!value.trim()) return t("errorsFrontend.validations.weightRequired");
      if (isNaN(numeric) || numeric < 5 || numeric > 300)
        return t("errorsFrontend.validations.weightInvalid");
      return null;
    },
    height: (value: string) => {
      const numeric = parseFloat(value);
      if (!value.trim()) return t("errorsFrontend.validations.heightRequired");
      if (isNaN(numeric) || numeric < 70 || numeric > 250)
        return t("errorsFrontend.validations.heightInvalid");
      return null;
    },
    gender: (value: string) => {
      if (!value)
        return t("errorsFrontend.validations.genderRequired");
      return null;
    },

  };
};
