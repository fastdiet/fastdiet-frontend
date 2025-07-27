import { useState } from "react";

interface ValidationRules {
  [key: string]: (value: any) => string | null;
}

interface FormErrors {
  [key: string]: string;
}

export const useFormValidation = (validationRules: ValidationRules) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (values: { [key: string]: any }) => {
    const newErrors: FormErrors = {};
    let isValid = true;

    for (const field in validationRules) {
      const error = validationRules[field](values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return { errors, validateForm };
};
