import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Text, TouchableOpacity } from 'react-native';
import { Search, Trash, XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface SearchInputProps extends TextInputProps {
  errorMessage?: string;
  disabled?: boolean;
   onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({errorMessage, disabled = false, onClear, ...props}) => {
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
      <View style={styles.inputWrapper}>
        <Search
          size={20}
          color={Colors.colors.gray[400]}
          style={styles.icon}
        />
        <TextInput
          {...props}
          style={inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.colors.gray[400]}
          editable={!disabled}
        />
        {props.value ? (
          <TouchableOpacity onPress={onClear} style={styles.clearIcon}>
            <XCircle size={20} color={Colors.colors.gray[400]} />
          </TouchableOpacity>
        ) : null}
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    fontFamily: "InterRegular",
    fontSize: 15,
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 40,
    borderColor: Colors.colors.gray[200],
    borderWidth: 1.2,
    borderRadius: 14,
    backgroundColor: Colors.colors.gray[100],
    color: Colors.colors.gray[700],
    width: "100%",
    minHeight: 48,
  },
  icon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  clearIcon: {
    position: 'absolute',
    right: 12,
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

export default SearchInput;