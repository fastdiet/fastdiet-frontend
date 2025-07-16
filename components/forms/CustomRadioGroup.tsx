import { Colors } from "@/constants/Colors";
import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";


interface RadioButtonOption {
  id: string;
  label: string;
  value: string;
}

interface CustomRadioGroupProps {
  radioButtons: RadioButtonOption[];
  layout?: 'row' | 'column';
  onPress: (value: string) => void;
  selectedId: string;
  errorMessage?: string;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ 
  radioButtons, 
  layout = 'row', 
  onPress, 
  selectedId,
  errorMessage
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.radioGroup, { flexDirection: layout }]}>
        {radioButtons.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.8}
            onPress={() => onPress(option.value)}
            style={[
              styles.radioOption,
              index < radioButtons.length - 1 && styles.marginRight,
              selectedId === option.value && styles.radioOptionSelected,
              errorMessage && styles.radioOptionError
            ]}
          >
            <View style={[
              styles.radioCircle,
              selectedId === option.value && styles.radioCircleSelected
            ]}>
              {selectedId === option.value && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  radioGroup: {
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    minHeight: 48,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: Colors.colors.gray[200],
    backgroundColor: Colors.colors.gray[100],
    flex: 1,
    minHeight: 48,
  },
  marginRight: {
    marginRight: 10,
  },
  radioOptionSelected: {
    borderColor: Colors.colors.primary[400],
    backgroundColor: Colors.colors.neutral[100],
  },
  radioOptionError: {
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
  radioLabel: {
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