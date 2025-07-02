// React & React Native Imports
import { Text, TouchableOpacity, View, StyleSheet} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

// Component Imports
import PaddingView from "@/components/views/PaddingView";
import ViewContentContinue from "@/components/views/ViewForContinueButton";
import ViewForm from "@/components/views/ViewForm";
import TitleParagraph from "@/components/text/TitleParagraph";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ErrorText from "@/components/text/ErrorText";

//Hooks imports
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

//Style imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";

//Constants imports
import { getIntoleranceOptions } from "@/constants/intoleranceConstants";


export default function SelectIntoleranceScreen() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [selectedIntoleranceIds, setSelectedIntoleranceIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const intoleranceOptions = getIntoleranceOptions(t);
  const { selectIntolerances } = useAuth();
  const router = useRouter();

  const toggleIntolerance = (id: number) => {
    setSelectedIntoleranceIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
    setErrorMessage("");
  };

  const handleContinue = async () => {
    setErrorMessage("");
    setLoading(true);
    const { success, error } = await selectIntolerances(selectedIntoleranceIds);
    if (!success) {
      setErrorMessage(error);
      setLoading(false);
      return;
    }

    router.replace("/menu/");
  };

  return (
    <>
      <View style={{ height: 16 }}></View>
      <PaddingView>
        <ViewContentContinue>
          <ViewForm>
            <TitleParagraph
              title={t(
                "auth.completeRegister.intolerance.titleParagraph.title"
              )}
              paragraph={t(
                "auth.completeRegister.intolerance.titleParagraph.paragraph"
              )}
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
            onPress={handleContinue}
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