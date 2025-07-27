// React & React Native Imports
import { FlatList, Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

// Component Imports
import PaddingView from "@/components/views/PaddingView";
import ViewForm from "@/components/views/ViewForm";
import TitleParagraph from "@/components/text/TitleParagraph";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ErrorText from "@/components/text/ErrorText";

// Hooks Imports
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

// Model Imports
import Diet from "@/models/diet";

// Style Imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";

// Constants Imports
import { getDietOptions } from "@/constants/diets";

export default function EditDietScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { selectDiet } = useAuth();
  const params = useLocalSearchParams<{ currentDietId: string }>();
  
  const [selectedDietId, setSelectedDietId] = useState<number | null>(
    params.currentDietId ? parseInt(params.currentDietId, 10) : null
  );
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const dietOptions = getDietOptions(t);

  const handleSave = async () => {
    if (!selectedDietId) return;
    
    setLoading(true);
    setErrorMessage("");
    
    const { success, error } = await selectDiet(selectedDietId);

    setLoading(false);

    if (success) {
      Toast.show({type: 'success', text1: t('profile.dietUpdated'),});
      router.back();
    } else {
      setErrorMessage(error?.message ?? "");
    }
  };

  const renderDietItem = ({ item }: {item: Diet}) => (
    <TouchableOpacity
      style={[
        styles.dietCard,
        selectedDietId === item.id && styles.selectedDietCard,
      ]}
      onPress={() => setSelectedDietId(item.id)}
    >
      <Text style={styles.dietIcon}>{item.emoji}</Text>
      <Text style={[globalStyles.mediumBodySemiBold, styles.dietName]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 0 }}>
          <View style={{ height: 16 }} />
          <PaddingView>
            <ViewForm>
              <TitleParagraph
                title={t("profile.edit.diet.title")}
                paragraph={t("profile.edit.diet.paragraph")}
              />
              {errorMessage ? <ErrorText text={errorMessage} /> : null}
              <View style={{ width: "100%" }}>
                <FlatList
                  data={dietOptions}
                  renderItem={renderDietItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={styles.columnWrapper}
                  scrollEnabled={false}
                  contentContainerStyle={styles.flatListContainer}
                />
              </View>
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
              disabled={!selectedDietId}
            />
          </PaddingView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    width: "100%",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.colors.neutral[100],
    paddingVertical: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.colors.gray[200],
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  dietCard: {
    width: "48%",
    aspectRatio: 1.5,
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.colors.gray[200],
    shadowColor: Colors.colors.gray[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDietCard: {
    backgroundColor: Colors.colors.primary[500],
    borderColor: Colors.colors.primary[200],
    shadowColor: Colors.colors.primary[200],
    shadowOpacity: 0.2,
  },
  dietIcon: {
    fontSize: 32,
    marginBottom: 8,
    color: Colors.colors.gray[500],
  },
  dietName: {
    textAlign: "center",
    color: Colors.colors.gray[500],
  },
});