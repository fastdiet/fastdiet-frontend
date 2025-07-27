// React & React Native Imports
import { View, StyleSheet, ScrollView } from "react-native";
import { useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

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
  const router = useRouter();
  const { t } = useTranslation();
  const { selectGoal } = useAuth();
  
  const params = useLocalSearchParams<{ currentGoal: string }>();
  
  const [selectedGoal, setSelectedGoal] = useState(params.currentGoal || "");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const goalOptions = getGoalOptions(t);

  const handleSave = async () => {
    if (!selectedGoal) {
      router.back();
      return;
    }
    
    setLoading(true);
    setErrorMessage("");
    
    const { success, error } = await selectGoal(selectedGoal);

    setLoading(false);

    if (success) {
      Toast.show({type: 'success', text1: t('profile.goalUpdated'),});
      router.back();
    } else {
      setErrorMessage(error?.message ?? "");
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 0 }}
        >
          <View style={{ height: 16 }}></View>
          <PaddingView>
            <ViewForm>
              <TitleParagraph
                title={t("profile.edit.goal.title")}
                paragraph={t(
                  "profile.edit.goal.paragraph"
                )}
              />
              {errorMessage ? <ErrorText text={errorMessage} /> : null}
              <StyledRadioButtonList
                options={goalOptions}
                selectedValue={selectedGoal}
                onSelect={setSelectedGoal}
            />
            </ViewForm>
          </PaddingView>
        </ScrollView>
        <View style={styles.fixedButtonContainer}>
          <PaddingView>
            <PrimaryButton
              title={t("save")}
              style={{ width: "100%" }}
              onPress={handleSave}
              loading={loading}
              disabled={!selectedGoal}
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
