// React & React Native Imports
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Style Imports
import globalStyles from "@/styles/global";

// Utility Imports
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

interface DividerProps {
  text?: string;
  full?: boolean; 
}

const Divider = ({ text, full = false }: DividerProps) => {
  const { t } = useTranslation();
  const dividerText = text || t("dividerText");
  return (
    <View style={styles.container}>
      <View
        style={[styles.line, { backgroundColor: Colors.colors.gray[200] }]}
      />
      {!full && <Text style={globalStyles.largeBodyMedium}>{dividerText}</Text>}
      <View
        style={[styles.line, { backgroundColor: Colors.colors.gray[200] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap:20,
    flexDirection: "row",
    alignItems: "center",

  },
  line: {
    flex: 1,
    minWidth: 50,
    height: 1, 
  }
});

export default Divider;
