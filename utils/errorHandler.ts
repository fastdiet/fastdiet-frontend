import { ApiError } from "@/context/AuthContext";
import i18n from "@/i18n";
import axios from "axios";

const backendErrorMap: Record<string, string> = {
  USER_NOT_FOUND: "errorsBackend.userNotFound",
  USERNAME_ALREADY_EXISTS: "errorsBackend.usernameExists",
  EMAIL_ALREADY_REGISTERED: "errorsBackend.emailAlreadyRegistered",
  EMAIL_ALREADY_VERIFIED: "errorsBackend.emailAlreadyVerified",
  EMAIL_NOT_VALID: "errorsBackend.invalidEmail",
  EMAIL_SEND_ERROR: "errorsBackend.emailSendError",
  USER_NOT_VERIFIED: "errorsBackend.userNotVerified",
  INVALID_CREDENTIALS: "errorsBackend.invalidCredentials",
  INVALID_TOKEN: "errorsBackend.invalidToken",
  INVALID_REFRESH_TOKEN: "errorsBackend.invalidRefreshToken",
  INVALID_EMAIL_VERIFICATION_CODE: "errorsBackend.invalidVerificationCode",
  INVALID_RESET_CODE: "errorsBackend.invalidResetCode",

  RECIPE_NOT_FOUND: "errorsBackend.recipeNotFound",
  RECIPE_LINKED_TO_MEAL_PLAN: "errorsBackend.recipeLinkedToMealPlan",
  DUPLICATED_INGREDIENT: "errorsBackend.duplicatedIngredient",
  CANNOT_DELETE_IMPORTED_RECIPE: "errorsBackend.cannotDeleteImportedRecipe",
  MEAL_ITEM_NOT_FOUND: "errorsBackend.mealItemNotFound",
  MEAL_PLAN_GENERATION_FAILED: "errorsBackend.mealPlanGenerationFailed",
  PREFERENCES_TOO_STRICT: "errorsBackend.preferencesTooStrict",
  USER_PREFERENCES_NOT_FOUND: "errorsBackend.userPreferencesNotFound",

  CUISINE_REGIONS_NOT_FOUND: "errorsBackend.cuisineRegionsNotFound",
  INTOLERANCES_NOT_FOUND: "errorsBackend.intolerancesNotFound",
  DIET_TYPE_NOT_FOUND: "errorsBackend.dietTypeNotFound",

  INCORRECT_CURRENT_PASSWORD: "errorsBackend.incorrectCurrentPassword",
  INTERNAL_SERVER_ERROR: "errorsBackend.internalServerError",
};

export const handleApiError = (error: unknown, defaultMessageKey = "errorsBackend.genericError"): ApiError => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return { code: 'TIMEOUT', message: i18n.t("errorsBackend.timeoutError") };
    }
    if (error.code === 'ERR_NETWORK') {
      return { code: 'NETWORK_ERROR', message: i18n.t("errorsBackend.serverError") };
    }
    if(error.response){
      const detail = error.response?.data?.detail;

      if (detail && typeof detail === "object" && "code" in detail && "message" in detail) {
        const code = detail.code;
        const translationKey = backendErrorMap[code] || defaultMessageKey;

        if (code === "DUPLICATED_INGREDIENT" && detail.ingredient) {
          return { code, message: i18n.t(translationKey, { ingredient: detail.ingredient }),};
        }

        return {code, message: i18n.t(translationKey),};
      }
    }
   
  }

  return {code: null, message: i18n.t(defaultMessageKey),};
};
