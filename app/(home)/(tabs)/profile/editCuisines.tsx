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
import Cuisine from "@/models/cuisine";

// Style Imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";

// Constants Imports
import { getCuisineOptions } from "@/constants/cuisines";

export default function EditCuisinesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectCuisines } = useAuth();
  const params = useLocalSearchParams<{ currentCuisineIds: string }>();
  
  const [selectedCuisineIds, setSelectedCuisineIds] = useState<number[]>(
    params.currentCuisineIds ? params.currentCuisineIds.split(',').map(Number) : []
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const cuisineOptions = getCuisineOptions(t);

  const toggleCuisine = (id: number) => {
    setSelectedCuisineIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
    setErrorMessage("");
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMessage("");
    
    const { success, error } = await selectCuisines(selectedCuisineIds);

    setLoading(false);

    if (success) {
      Toast.show({type: 'success', text1: t('profile.cuisinesUpdated'),});
      router.back();
    } else {
      setErrorMessage(error?.message ?? "");
    }
  };

  const renderCuisineItem = ({ item }: { item: Cuisine }) => (
    <TouchableOpacity
      style={[
        styles.cuisineCard,
        selectedCuisineIds.includes(item.id) && styles.selectedCuisineCard,
      ]}
      onPress={() => toggleCuisine(item.id)}
    >
      <Text style={styles.cuisineIcon}>{item.emoji}</Text>
      <Text style={[globalStyles.mediumBodySemiBold, styles.cuisineName]}>
        {item.name}
      </Text>
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
                title={t("profile.edit.cuisines.title")}
                paragraph={t("profile.edit.cuisines.paragraph")}
              />
              {errorMessage ? <ErrorText text={errorMessage} /> : null}
              <View style={{ width: "100%" }}>
                <FlatList
                  data={cuisineOptions}
                  renderItem={renderCuisineItem}
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
  cuisineCard: {
    width: "48%",
    aspectRatio: 1.5,
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.colors.gray[200],
    shadowColor: Colors.colors.gray[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCuisineCard: {
    backgroundColor: Colors.colors.primary[500],
    borderColor: Colors.colors.primary[200],
    shadowColor: Colors.colors.primary[200],
    shadowOpacity: 0.2,
  },
  cuisineIcon: {
    fontSize: 32,
    marginBottom: 8,
    color: Colors.colors.gray[500],
  },
  cuisineName: {
    textAlign: "center",
    color: Colors.colors.gray[500],
  },
});