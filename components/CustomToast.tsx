import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';

interface CustomToastProps {
  text1?: string;
  text2?: string;
  props: any;
}

const SuccessToast = ({ text1, text2 }: CustomToastProps) => (
  <View style={[styles.base, styles.successBase]}>
    <Ionicons name="checkmark-circle-outline" size={24} color={Colors.colors.success[100]} style={styles.icon} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.text1}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  </View>
);

const ErrorToastCustom = ({ text1, text2 }: CustomToastProps) => (
  <View style={[styles.base, styles.errorBase]}>
    <Ionicons name="alert-circle-outline" size={24} color={Colors.colors.error[100]} style={styles.icon} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.text1}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  </View>
);

export const toastConfig = {
  success: (props: CustomToastProps) => <SuccessToast {...props} />,
  error: (props: CustomToastProps) => <ErrorToastCustom {...props} />,
};

const styles = StyleSheet.create({
  base: {
    width: '90%',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  successBase: {
    backgroundColor: Colors.colors.success[400]
  },
  errorBase: {
    backgroundColor: Colors.colors.error[400]
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    ...globalStyles.largeBodySemiBold,
  },
  text2: {
    ...globalStyles.mediumBodyRegular,
    lineHeight: 18,
    marginTop: 4,
    opacity: 0.9,
  },
});