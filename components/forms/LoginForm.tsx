// React & React Native Imports
import { useState } from "react";
import { Text, TouchableOpacity, ImageBackground, TouchableWithoutFeedback, Keyboard, View } from "react-native";
import { useRouter } from "expo-router";

// Component Imports
import globalStyles from "@/styles/global";
import StyledTextInput from "@/components/forms/StyledTextInput";
import PaddingView from "@/components/views/PaddingView";
import DividerWithText from "@/components/Divider";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GoogleSignInButton from "@/components/buttons/GoogleSignInButton";
import ErrorText from "@/components/text/ErrorText";
import TitleParagraph from "@/components/text/TitleParagraph";
import ViewForm from "@/components/views/ViewForm";
import ViewInputs from "@/components/views/ViewInputs";
import ViewContentContinue from "@/components/views/ViewForContinueButton";
import PasswordInput from "@/components/forms/PasswordInput"; 

// Hook Imports
import { useFormValidation } from "@/hooks/useFormValidation";
import { useTranslation } from "react-i18next"
import { useValidations } from "@/hooks/useValidations";
import { useAuth } from "@/hooks/useAuth";


const LoginForm = () => {
  const router = useRouter();
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const validations = useValidations();

  const { errors, validateForm } = useFormValidation({
    userid: (value) => {
      if (!value.trim()) return t("errorsFrontend.validations.emptyUserid");
      if (value.includes("@")) {
        return validations.email(value);
      } else {
        return validations.username(value);
      }
    },
    password: validations.password,
  });

  const handleLogin = async () => {
    setErrorMessage("");
    const isValid = validateForm({ userid, password });

    if (!isValid) return;
    setLoading(true);
    const { success, error } = await login(userid, password);

    if (!success) {
      setErrorMessage(error);
      setLoading(false); 
      return;
    }
    
    router.replace("/menu/"); 
  };

  return <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/loginFastdiet.png")}
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
              title={t("auth.login.titleParagraph.title")}
              paragraph={t("auth.login.titleParagraph.paragraph")}
            />

            {errorMessage ? <ErrorText text={errorMessage} /> : null}
            <ViewInputs>
              <StyledTextInput
                style={globalStyles.largeBodyMedium}
                placeholder={t("auth.login.username")}
                autoCapitalize="none"
                value={userid}
                onChangeText={setUserid}
                errorMessage={errors.userid}
              />
              <PasswordInput
                style={globalStyles.largeBodyMedium}
                placeholder={t("auth.login.password")}
                value={password}
                onChangeText={setPassword}
                errorMessage={errors.password}
              />
            </ViewInputs>
            <TouchableOpacity
              onPress={() => router.push("/sendPasswordResetCode")}
            >
              <Text style={globalStyles.mediumBodyMedium}>
                {t("auth.login.forgotPassword")}
                <Text style={globalStyles.link}>
                  {t("auth.login.recoverLink")}
                </Text>
              </Text>
            </TouchableOpacity>
            <DividerWithText />

            <GoogleSignInButton />

            <TouchableOpacity onPress={() => router.replace("/register")}>
              <Text style={globalStyles.mediumBodyMedium}>
                {t("auth.login.notAccount")}
                <Text style={globalStyles.link}>
                  {t("auth.login.registerLink")}
                </Text>
              </Text>
            </TouchableOpacity>
          </ViewForm>
          <PrimaryButton
            title={t("continue")}
            onPress={handleLogin}
            style={{ width: "100%" }}
            loading={loading}
          />
        </ViewContentContinue>
      </PaddingView>
    </View>
    </TouchableWithoutFeedback>
};

export default LoginForm;

