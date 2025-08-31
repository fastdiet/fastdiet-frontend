// React & React Native Imports
import { View, StyleSheet, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

// Component Imports
import PaddingView from "@/components/views/PaddingView";
import ViewForm from "@/components/views/ViewForm";
import TitleParagraph from "@/components/text/TitleParagraph";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import StyledRadioButtonList from "@/components/forms/StyledRadioButtonList";
import ErrorText from "@/components/text/ErrorText";

// Hooks imports
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

// Style imports
import { Colors } from "@/constants/Colors";
import { getGoalOptions } from "@/constants/goals";



export default function SelectGoalScreen() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [goal, setGoal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { selectGoal, userPreferences } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const goalOptions = getGoalOptions(t);
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const isEditMode = edit === 'true';

  useEffect(() => {
    if (isEditMode && userPreferences?.goal) {
      setGoal(userPreferences.goal || "");
    }
  }, [isEditMode, userPreferences]); 
  

  const handleContinue = async () => {
    setErrorMessage("");
    if (!goal) {
      setErrorMessage(t("errorsFrontend.selectGoal"));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setLoading(true);
    
    const { success, error } = await selectGoal(goal);
    if (!success) {
      setErrorMessage(error?.message ?? "");
      setLoading(false);
      return;
    }

    setLoading(false);

    const nextRoute = "/complete-register/selectDiet";
    if (isEditMode) {
      router.push(`${nextRoute}?edit=true`);
    } else {
      router.push(nextRoute);
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 0 }}
        >
          <View style={{ height: 16 }}></View>
          <PaddingView>
            <ViewForm>
              <TitleParagraph
                title={isEditMode 
                  ? t("profile.edit.goal.title") 
                  : t("auth.completeRegister.goal.titleParagraph.title")}
                paragraph={isEditMode 
                  ? t("profile.edit.goal.paragraph")
                  : t("auth.completeRegister.goal.titleParagraph.paragraph")}
              />
              {errorMessage ? <ErrorText text={errorMessage} /> : null}
              <StyledRadioButtonList
                options={goalOptions}
                selectedValue={goal}
                onSelect={setGoal}
            />
            </ViewForm>
          </PaddingView>
        </ScrollView>
        <View style={styles.fixedButtonContainer}>
          <PaddingView>
            <PrimaryButton
              title={t("continue")}
              style={{ width: "100%" }}
              onPress={handleContinue}
              loading={loading}
              disabled={!goal}
            />
          </PaddingView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.colors.neutral[100],
    paddingVertical: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.colors.gray[200],
  },
  
});
