// React & React Native Imports
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

// Style Imports
import globalStyles from '@/styles/global';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  style = {},
  textStyle = {},
  disabled = false,
  loading = false,
}) => {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.colors.neutral[100]} />
      ) : (
        <Text
          style={[
            globalStyles.largeBodySemiBold,
            styles.text,
            textStyle,
            isDisabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.colors.primary[100], 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: Colors.colors.gray[200],
  },
  text: {
    color: Colors.colors.neutral[100],
    fontSize: 17,
  },
  disabledText: {
    color: Colors.colors.gray[400],
  },
});

export default PrimaryButton;
