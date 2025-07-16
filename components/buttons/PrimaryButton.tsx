// React & React Native Imports
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';

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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode
}

const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  style = {},
  textStyle = {},
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
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
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}
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
          {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: Colors.colors.primary[100], 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginBottom: 16,
    minHeight: 50,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginHorizontal: 8,
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
