import { Colors } from "@/constants/Colors";
import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";


interface RadioButtonOption {
  id: string;
  label: string;
  value: string;
}

interface CustomRadioGroupProps {
  options: RadioButtonOption[];
  layout?: 'row' | 'column';
  onValueChange: (value: string) => void;
  selectedValue: string | string[]; 
  mode?: 'single' | 'multiple';
  errorMessage?: string;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ 
  options, 
  layout = 'row', 
  onValueChange, 
  mode = 'single',
  selectedValue,
  errorMessage
}) => {

  const isMultiple = mode === 'multiple';

  return (
    <View style={styles.container}>
      <View style={[styles.groupContainer, { flexDirection: layout }]}>
        {options.map((option, index) => {
          const isSelected = isMultiple 
            ? (selectedValue as string[]).includes(option.value)
            : selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.8}
              onPress={() => onValueChange(option.value)}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                errorMessage && styles.optionError
              ]}
            >
              <View style={[
                styles.radioCircle,
                isSelected && (styles.radioCircleSelected)
              ]}>
                {isSelected && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <Text style={styles.label}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  groupContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    minHeight: 48,
    gap: 10
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: Colors.colors.gray[200],
    backgroundColor: Colors.colors.gray[100],
    minHeight: 48,
  },
  optionSelected: {
    borderColor: Colors.colors.primary[400],
    backgroundColor: Colors.colors.neutral[100],
  },
  optionError: {
    borderColor: Colors.colors.error[100],
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: Colors.colors.primary[400],
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.colors.primary[400],
  },
  label: {
    fontFamily: 'InterRegular',
    fontSize: 15,
    color: Colors.colors.gray[700],
  },
  errorText: {
    color: Colors.colors.error[100],
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
});
export default CustomRadioGroup;