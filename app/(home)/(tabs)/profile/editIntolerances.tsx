// React & React Native Imports
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

// Component Imports
import PaddingView from "@/components/views/PaddingView";
import ViewForm from "@/components/views/ViewForm";
import TitleParagraph from "@/components/text/TitleParagraph";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ErrorText from "@/components/text/ErrorText";
import ViewContentContinue from "@/components/views/ViewForContinueButton";

// Hooks Imports
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

// Style Imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";

// Constants Imports
import { getIntoleranceOptions } from "@/constants/intolerances";

export default function EditIntolerancesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectIntolerances } = useAuth();
  
  const params = useLocalSearchParams<{ currentIntoleranceIds: string }>();
  
  const [selectedIntoleranceIds, setSelectedIntoleranceIds] = useState<number[]>(
    params.currentIntoleranceIds ? params.currentIntoleranceIds.split(',').map(Number) : []
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const intoleranceOptions = getIntoleranceOptions(t);

  const toggleIntolerance = (id: number) => {
    setSelectedIntoleranceIds((prev) =>
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
    setErrorMessage("");
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMessage("");
    
    const { success, error } = await selectIntolerances(selectedIntoleranceIds);

    setLoading(false);

    if (success) {
      Toast.show({
        type: 'success',
        text1: t('profile.intolerancesUpdated'),
        position: 'bottom'
      });
      router.back();
    } else {
      setErrorMessage(error);
    }
  };

  return (
    <>
      <View style={{ height: 16 }}></View>
      <PaddingView>
        <ViewContentContinue>
          <ViewForm>
            <TitleParagraph
              title={t("profile.edit.intolerances.title")}
              paragraph={t("profile.edit.intolerances.paragraph")}
            />
            {errorMessage ? <ErrorText text={errorMessage} /> : null}
            <View style={{ width: "100%" }}>
              <View style={styles.chipContainer}>
                {intoleranceOptions.map((item) => {
                  const isSelected = selectedIntoleranceIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.chip, isSelected && styles.selectedChip]}
                      onPress={() => toggleIntolerance(item.id)}
                    >
                      <Text
                        style={[globalStyles.smallBodySemiBold, styles.chipText,]}
                      >
                        {item.name} {item.emoji}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ViewForm>
          <PrimaryButton
            title={t("continue")}
            style={{ width: "100%" }}
            onPress={handleSave}
            loading={loading}
          />
        </ViewContentContinue>
      </PaddingView>
    </>
  );

}

const styles = StyleSheet.create({
  chipContainer: {
   flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
    width: "100%",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.colors.gray[200],
    marginRight: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedChip: {
    backgroundColor: Colors.colors.primary[500],
    borderColor: Colors.colors.primary[200],
  },
  chipText: {
    color: Colors.colors.gray[500],
  }
});