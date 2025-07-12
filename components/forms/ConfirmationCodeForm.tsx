// React & React Native Imports
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';

// Component Imports
import PrimaryButton from "@/components/buttons/PrimaryButton";
import StyledTextInput from "@/components/forms/StyledTextInput";
import ErrorText from "@/components/text/ErrorText";
import TitleParagraph from "@/components/text/TitleParagraph";
import PaddingView from "@/components/views/PaddingView";
import ViewContentContinue from "@/components/views/ViewForContinueButton";
import ViewForm from "@/components/views/ViewForm";

// Style Imports
import globalStyles from "@/styles/global";
import { useTranslation } from 'react-i18next';



interface ConfirmationCodeFormProps {
  onSubmit: (code: string) => void;
  onResend: () => void;
  loading: boolean;
  resendLoading: boolean;
  errorMessage?: string;
  codeError?: string;
  email: string;
}

export default function ConfirmationCodeForm({
  onSubmit,
  onResend,
  loading,
  resendLoading,
  errorMessage,
  codeError,
  email,
}: ConfirmationCodeFormProps) {
  const [code, setCode] = useState("");
  const { t } = useTranslation();
  const handleSubmit = () => {
    if (code.length === 6) {
      onSubmit(code);
    }
  };

  return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
          <View style={{ height: 16 }}></View>
            <PaddingView>
              <ViewContentContinue>
                <ViewForm>
                  <TitleParagraph
                    title={t("auth.verifyCode.titleParagraph.title")}
                    paragraph={`${t(
                      "auth.verifyCode.titleParagraph.paragraph"
                    )}${email}`}
                  />

                  {errorMessage && <ErrorText text={errorMessage} />}

                  <StyledTextInput
                    style={globalStyles.largeBodyMedium}
                    placeholder={t("auth.verifyCode.codePlaceholder")}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={code}
                    onChangeText={setCode}
                    errorMessage={codeError}
                  />

                  <TouchableOpacity onPress={onResend} disabled={resendLoading}>
                    {resendLoading ? (
                      <Text style={globalStyles.mediumBodyMedium}>
                        {t("auth.verifyCode.sending")}
                      </Text>
                    ) : (
                      <Text style={globalStyles.mediumBodyMedium}>
                        {t("auth.verifyCode.noCode")}
                        <Text style={globalStyles.link}>
                          {t("auth.verifyCode.sendOtherCodeLink")}
                        </Text>
                      </Text>
                    )}
                  </TouchableOpacity>
                </ViewForm>

                <PrimaryButton
                  title={t("auth.verifyCode.verify")}
                  onPress={handleSubmit}
                  disabled={code.length !== 6}
                  style={{ width: "100%" }}
                  loading={loading}
                />
              </ViewContentContinue>
            </PaddingView>
          </View>
        </TouchableWithoutFeedback>
  );
}