// React & React Native Imports
import React, { useState } from "react";
import { TextInput, TextInputProps, StyleSheet, View, Text } from "react-native";

// Utility Imports
import { Colors } from "@/constants/Colors";


interface CustomTextInputProps extends TextInputProps {
  errorMessage?: string; 
  disabled?: boolean; 
}

const StyledTextInput: React.FC<CustomTextInputProps> = ({
  errorMessage,
  disabled = false,
  ...props
}) => {
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
      <TextInput
        {...props}
        style={inputStyles}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    fontFamily: "InterRegular",
    padding: 10,
    borderColor: Colors.colors.gray[200],
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: Colors.colors.gray[100],
    color: Colors.colors.gray[400], 
    width: "100%",
    minHeight: 48,
  },
  focused: {
    borderColor: Colors.colors.primary[400], 
    backgroundColor: Colors.colors.neutral[100], 
  },
  error: {
    borderColor: Colors.colors.error[100], 
  },
  disabled: {
    backgroundColor: Colors.colors.gray[200], 
    borderColor: Colors.colors.gray[300], 
  },
  errorText: {
    color: Colors.colors.error[100],
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },

});

export default StyledTextInput;
