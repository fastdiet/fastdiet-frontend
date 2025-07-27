// React & React Native Imports
import { useState, useContext } from "react";
import { View, Text, TouchableOpacity, ImageBackground, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";

// Component Imports
import { AuthContext } from "@/context/AuthContext";
import DividerWithText from "@/components/Divider";
import StyledTextInput from "@/components/forms/StyledTextInput";
import PaddingView from "@/components/views/PaddingView";
import GoogleSignInButton from "@/components/buttons/GoogleSignInButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ViewContentContinue from "@/components/views/ViewForContinueButton";
import ViewForm from "@/components/views/ViewForm";
import TitleParagraph from "@/components/text/TitleParagraph";
import ViewInputs from "@/components/views/ViewInputs";
import ErrorText from "@/components/text/ErrorText";
import PasswordInput from "@/components/forms/PasswordInput";

// Hook Imports
import { useFormValidation } from "@/hooks/useFormValidation";
import { useValidations } from "@/hooks/useValidations";
import { useTranslation } from "react-i18next";

// Style Imports
import globalStyles from "@/styles/global";



const RegisterScreen = () => {
  const router = useRouter();
  const { register, sendVerificationCode } = useContext(AuthContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  
  const [loading, setLoading] = useState(false);
  const validations = useValidations();
  const { errors, validateForm } = useFormValidation({
    email: validations.email,
    password: validations.password,
    passwordCheck: (value) => validations.passwordCheck(value, password),
  });
  const {t} = useTranslation();

  const handleRegister = async () => {
    setErrorMessage("");
    const isValid = validateForm({ email, password, passwordCheck });
    if (!isValid) return;
    
    setLoading(true);
    const { success, error } = await register(email, password);

    if (!success) {
      setErrorMessage(error?.message ?? "");
      setLoading(false);
      return;
    }

    const { success: successCC, error: errorCC } = await sendVerificationCode(email);
    if (!successCC) {
      setErrorMessage(errorCC?.message ?? "");
      setLoading(false);
      return;
    }
    router.push(`/verifyEmail`);
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("@/assets/images/registerFastdiet.png")}
          style={{
            width: "100%",
            height: 124,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}
          resizeMode="cover"
        ></ImageBackground>

        <PaddingView>
          <ViewContentContinue>
            <ViewForm>
              <TitleParagraph
                title={t("auth.register.titleParagraph.title")}
                paragraph={t("auth.register.titleParagraph.paragraph")}
              />
              {errorMessage ? <ErrorText text={errorMessage} /> : null}
              <ViewInputs>
                <StyledTextInput
                  placeholder={t("auth.register.email")}
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  errorMessage={errors.email}
                />
                <PasswordInput
                  placeholder={t("auth.register.password")}
                  value={password}
                  onChangeText={setPassword}
                  errorMessage={errors.password}
                />
                <PasswordInput
                  placeholder={t("auth.register.repeatPassword")}
                  value={passwordCheck}
                  onChangeText={setPasswordCheck}
                  errorMessage={errors.passwordCheck}
                />
                <View
                  style={{ paddingHorizontal: 16, marginTop: 4, width: "100%" }}
                >
                  <Text style={globalStyles.smallBodyRegular}>
                    {t("auth.register.passwordDetails")}
                  </Text>
                </View>
              </ViewInputs>
              <DividerWithText />

              <GoogleSignInButton />
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={globalStyles.mediumBodyMedium}>
                  {t("auth.register.alreadyAccount")}
                  <Text style={globalStyles.link}>
                    {t("auth.register.loginLink")}
                  </Text>
                </Text>
              </TouchableOpacity>
            </ViewForm>
            <PrimaryButton
              title={t("continue")}
              onPress={handleRegister}
              style={{ width: "100%" }}
              loading={loading}
            />
          </ViewContentContinue>
        </PaddingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;


