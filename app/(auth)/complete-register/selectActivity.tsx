// React & React Native Imports
import { View, StyleSheet, ScrollView } from "react-native";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";

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
import { getActivityOptions } from "@/constants/activity_levels";


export default function SelectActivityScreen() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [activityLevel, setActivityLevel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { selectActivity } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const activityOptions = getActivityOptions(t);

  const handleContinue = async () => {
    setErrorMessage("");
    if (!activityLevel) {
      setErrorMessage(t("errorsFrontend.selectActivity"));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setLoading(true);
    
    const { success, error } = await selectActivity(activityLevel);
    if (!success) {
      setErrorMessage(error);
      setLoading(false);
      return;
    }

    router.push("/complete-register/selectGoal");
    setLoading(false);
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
                title={t("auth.completeRegister.activity.titleParagraph.title")}
                paragraph={t(
                  "auth.completeRegister.activity.titleParagraph.paragraph"
                )}
              />
              {errorMessage ? <ErrorText text={errorMessage} /> : null}
              <StyledRadioButtonList
                options={activityOptions}
                selectedValue={activityLevel}
                onSelect={setActivityLevel}
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
              disabled={!activityLevel}
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
