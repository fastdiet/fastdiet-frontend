import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {Colors} from "@/constants/Colors";

type Option = {
  id: string;
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selectedId: string;
  onPress: (id: string) => void;
  errorMessage?: string;
};

const StyledRadioGroup: React.FC<Props> = ({ options, selectedId, onPress, errorMessage }) => {
  return (
    <View style={styles.container}>
      <View style={styles.group}>
        {options.map((option) => {
          const selected = selectedId === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                selected && styles.selected,
                errorMessage && styles.errorBorder
              ]}
              onPress={() => onPress(option.id)}
            >
              <Text style={[styles.label, selected && styles.selectedLabel]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  option: {
    flex: 1,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.colors.gray[200],
    backgroundColor: Colors.colors.gray[100],
    alignItems: 'center',
  },
  selected: {
    borderColor: Colors.colors.primary[400],
    backgroundColor: Colors.colors.neutral[100],
  },
  errorBorder: {
    borderColor: Colors.colors.error[100],
  },
  label: {
    fontFamily: 'InterRegular',
    color: Colors.colors.gray[400],
  },
  selectedLabel: {
    color: Colors.colors.primary[400],
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.colors.error[100],
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
});

export default StyledRadioGroup;