import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const globalStyles = StyleSheet.create({
  mediumBodySemiBold: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    lineHeight: 20,
    color: Colors.colors.gray[400],
  },
  mediumBodyBold: {
    fontFamily: "InterBold",
    fontSize: 16,
    lineHeight: 20,
    color: Colors.colors.gray[400],
  },
  extraSmallSemiBold: {
    fontFamily: "InterSemiBold",
    fontSize: 10,
    lineHeight: 16,
    color: Colors.colors.gray[400],
  },
  extraSmallRegular: {
    fontFamily: "InterRegular",
    fontSize: 10,
    lineHeight: 16,
    color: Colors.colors.gray[400],
  },
  mediumBodyRegular: {
    fontFamily: "InterRegular",
    fontSize: 14,
    lineHeight: 16,
    color: Colors.colors.gray[400],
  },
  mediumBodyMedium: {
    fontFamily: "InterMedium",
    fontSize: 14,
    lineHeight: 16,
    color: Colors.colors.gray[400],
  },
  smallBodySemiBold: {
    fontFamily: "InterSemiBold",
    fontSize: 12,
    lineHeight: 16,
    color: Colors.colors.gray[400],
  },
  smallBodyRegular: {
    fontFamily: "InterRegular",
    fontSize: 12,
    lineHeight: 16,
    color: Colors.colors.gray[400],
  },
  subtitle: {
    fontFamily: "InterSemiBold",
    fontSize: 18,
    lineHeight: 20,
    color: Colors.colors.gray[500],
  },
  largeBodySemiBold: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    lineHeight: 20,
    color: Colors.colors.gray[500],
  },
  largeBodyBold: {
    fontFamily: "InterBold",
    fontSize: 16,
    lineHeight: 20,
    color: Colors.colors.gray[400],
  },
  largeBodyMedium: {
    fontFamily: "InterMedium",
    fontSize: 16,
    lineHeight: 20,
    color: Colors.colors.gray[400],
  },
  title: {
    fontFamily: "InterSemiBold",
    fontSize: 24,
    lineHeight: 28,
    color: Colors.colors.gray[500],
  },
  diplaySemiBold: {
    fontFamily: "InterBlack",
    fontSize: 24,
    lineHeight: 24,
    color: Colors.colors.gray[500],
  },
  link: {
    color: Colors.colors.primary[200],
    textDecorationLine: "underline",
  },
});

export default globalStyles;
