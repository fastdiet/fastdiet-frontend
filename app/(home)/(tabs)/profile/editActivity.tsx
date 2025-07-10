// React & React Native Imports
import { View, StyleSheet, ScrollView } from "react-native";
import { useMemo, useState } from "react";
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
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getActivityOptions } from "@/constants/activity_levels";

export default function EditActivityScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectActivity } = useAuth();
  const params = useLocalSearchParams<{ currentActivity: string }>();
  const [selectedActivity, setSelectedActivity] = useState(params.currentActivity || "");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const activityOptions = getActivityOptions(t);

  const handleSave = async () => {
    if (!selectedActivity) return;
    
    setLoading(true);
    setErrorMessage("");
    
    const { success, error } = await selectActivity(selectedActivity);

    setLoading(false);

    if (success) {
      Toast.show({
        type: 'success',
        text1: t('profile.activityUpdated'), 
        position: 'bottom'
      });
      router.back();
    } else {
      setErrorMessage(error);
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 0 }}
        >
          <View style={{ height: 16 }} />
          <PaddingView>
            <ViewForm>
              <TitleParagraph
                title={t("profile.edit.activity.title")}
                paragraph={t("profile.edit.activity.paragraph")}
              />
              {errorMessage ? <ErrorText text={errorMessage} /> : null}
              <StyledRadioButtonList
                options={activityOptions}
                selectedValue={selectedActivity}
                onSelect={setSelectedActivity}
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
              disabled={!selectedActivity}
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