// React & React Native Imports
import React, { useState } from "react";
import { TextInput, TextInputProps, StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Utility Imports
import { Colors } from "@/constants/Colors";

// Icon Imports
import { Eye, EyeOff } from 'lucide-react-native';


interface CustomTextInputProps extends TextInputProps {
  errorMessage?: string;
  disabled?: boolean;
}

const PasswordInput: React.FC<CustomTextInputProps> = ({
  errorMessage,
  disabled = false,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const inputStyles = [
    styles.input,
    isFocused && !disabled && styles.focused,
    errorMessage && styles.error,
    disabled && styles.disabled,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          style={inputStyles}
          editable={!disabled}
          placeholderTextColor={Colors.colors.gray[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <Eye size={22} color={Colors.colors.gray[400]} />
          ) : (
            <EyeOff size={22} color={Colors.colors.gray[400]} />
          )}
        </TouchableOpacity>
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    fontFamily: "InterRegular",
    fontSize: 15,
    padding: 10,
    paddingRight: 40,
    borderColor: Colors.colors.gray[200],
    borderWidth: 1.2,
    borderRadius: 14,
    backgroundColor: Colors.colors.gray[100],
    color: Colors.colors.gray[700],
    width: "100%",
    minHeight: 48,
  },
  error: {
    borderColor: Colors.colors.error[100],
  },
  disabled: {
    backgroundColor: Colors.colors.gray[200],
    borderColor: Colors.colors.gray[300],
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  focused: {
    borderColor: Colors.colors.primary[400],
    backgroundColor: Colors.colors.neutral[100],
  },
  errorText: {
    color: Colors.colors.error[100],
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
});

export default PasswordInput;

