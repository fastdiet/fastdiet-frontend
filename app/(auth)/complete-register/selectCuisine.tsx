// React & React Native Imports
import { FlatList, Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

// Component Imports
import PaddingView from "@/components/views/PaddingView";
import ViewForm from "@/components/views/ViewForm";
import TitleParagraph from "@/components/text/TitleParagraph";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ErrorText from "@/components/text/ErrorText";

// Hooks imports
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

// Style imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";

// Constants imports
import { getCuisineOptions } from "@/constants/cuisines";

// Model imports
import Cuisine from "@/models/cuisine";

export default function SelectCuisineScreen() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [selectedCuisineIds, setSelectedCuisineIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const cuisineOptions = getCuisineOptions(t);
  const { selectCuisines, userPreferences } = useAuth();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const isEditMode = edit === 'true';

  useEffect(() => {
    if (isEditMode && userPreferences?.cuisines && userPreferences.cuisines.length > 0) {
      setSelectedCuisineIds(userPreferences.cuisines.map((cuisine: Cuisine) => cuisine.id));
    }
  }, [isEditMode, userPreferences]); 

  const toggleCuisine = (id: number) => {
    setSelectedCuisineIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
    setErrorMessage("");
  };

  const handleContinue = async () => {
    setErrorMessage("");
    if (selectedCuisineIds.length === 0) {
      setErrorMessage(t("errorsFrontend.selectCuisine"));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setLoading(true);

    const { success, error } = await selectCuisines(selectedCuisineIds);
    if (!success) {
      setErrorMessage(error?.message ?? "");
      setLoading(false);
      return;
    }

    setLoading(false);

    const nextRoute = "/complete-register/selectIntolerance";
    if (isEditMode) {
      router.push(`${nextRoute}?edit=true`);
    } else {
      router.push(nextRoute);
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
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 0 }}
        >
          <View style={{ height: 16 }}></View>
          <PaddingView>
            <ViewForm>
              <TitleParagraph
                title={t("auth.completeRegister.cuisine.titleParagraph.title")}
                paragraph={t(
                  "auth.completeRegister.cuisine.titleParagraph.paragraph"
                )}
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
              title={t("continue")}
              style={{ width: "100%" }}
              onPress={handleContinue}
              disabled={selectedCuisineIds.length === 0}
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