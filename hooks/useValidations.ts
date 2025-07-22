import { FormInputIngredient, FormInputStep } from "@/models/recipeInput";
import { useTranslation } from "react-i18next";
import validate from "react-native-email-validator";


const hasDuplicateIngredients = (ingredients: FormInputIngredient[]) => {
  const names = ingredients
    .map(i => i.name.trim().toLowerCase())
    .filter(name => name);

  const nameSet = new Set();

  for (const name of names) {
    if (nameSet.has(name)) {
      return name;
    }
    nameSet.add(name);
  }

  return null;
};

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
    required: (value: string) => {
      if (!value || !value.trim()) 
        return t("errorsFrontend.validations.required");
      return null;
    },
    titleRecipe: (value: string) => {
      if (!value || !value.trim()) 
        return t("errorsFrontend.validations.required");
      if (value.length > 60)
        return t("errorsFrontend.validations.recipeTitleLength");
      return null;
    },
    requiredPositiveNumber: (value: string) => {
      if (!value || !value.trim()) {
        return t("errorsFrontend.validations.required");
      }
      
      const numeric = parseFloat(value.replace(',', '.'));

      if (isNaN(numeric)) {
        return t("errorsFrontend.validations.numericInvalid");
      }
      
      if (numeric <= 0) {
        return t("errorsFrontend.validations.positiveNumberInvalid");
      }
        
      return null;
    },
    ingredientsList: (value: FormInputIngredient[]) => {
      for (const ingredient of value) {
        const hasName = ingredient.name.trim();
        const isAmountNumeric = !isNaN(parseFloat(ingredient.amount.trim().replace(',', '.')));
        const unit = ingredient.unit ? ingredient.unit.trim() : "";
        

        if (hasName && !isAmountNumeric) {
          return t("errorsFrontend.validations.ingredientMissingAmount", { name: ingredient.name });
        }
        if (!hasName && isAmountNumeric) {
            return t("errorsFrontend.validations.ingredientMissingName");
        }
        if (unit && !isNaN(parseFloat(unit))) {
          return t("errorsFrontend.validations.ingredientInvalidUnit", { name: ingredient.name });
        }
      }
      const duplicated = hasDuplicateIngredients(value);
      if (duplicated) {
        return t("errorsFrontend.validations.ingredientDuplicated", { name: duplicated });
      }
      
      return null;
    },

  };
};
