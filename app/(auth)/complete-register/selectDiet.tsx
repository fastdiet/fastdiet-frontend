// React & React Native Imports
import { FlatList, Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";

// Component Imports
import PaddingView from "@/components/views/PaddingView";
import ViewForm from "@/components/views/ViewForm";
import TitleParagraph from "@/components/text/TitleParagraph";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ErrorText from "@/components/text/ErrorText";
import { useTranslation } from "react-i18next";
import Diet from "@/models/diet";
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";
import { useAuth } from "@/hooks/useAuth";
import { getDietOptions } from "@/constants/dietConstants";


export default function SelectDietScreen() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [selectedDietId, setSelectedDietId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dietOptions = getDietOptions(t);
  const { selectDiet } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();


  const handleSaveDiet = async () => {
    setErrorMessage("");
    if (!selectedDietId) {
      setErrorMessage(t("errorsFrontend.selectDiet"));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setLoading(true);
    
    const { success, error } = await selectDiet(selectedDietId);
    if (!success) {
      setErrorMessage(error);
      setLoading(false);
      return;
    }

    router.push("/complete-register/selectCuisine"); 
  };

  const renderDietItem = ({ item }: {item: Diet}) => (
    <TouchableOpacity
      style={[
        styles.dietCard,
        selectedDietId === item.id && styles.selectedDietCard,
      ]}
      onPress={() => {
        setSelectedDietId(selectedDietId === item.id ? null : item.id);
        setErrorMessage("");
      }}
    >
      <Text style={styles.dietIcon}>{item.emoji}</Text>
      <Text style={[globalStyles.mediumBodySemiBold, styles.dietName]}>{item.name}</Text>
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
                title={t("auth.completeRegister.diet.titleParagraph.title")}
                paragraph={t(
                  "auth.completeRegister.diet.titleParagraph.paragraph"
                )}
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
              title={t("continue")}
              style={{ width: "100%" }}
              onPress={handleSaveDiet}
              disabled={!selectedDietId}
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
