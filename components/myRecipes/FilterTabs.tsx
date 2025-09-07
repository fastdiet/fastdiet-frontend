import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';


interface FilterTabsProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ options, selectedValue, onSelect }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={[styles.tab, isSelected && styles.selectedTab]}
          >
            <Text style={[styles.tabText, isSelected && styles.selectedTabText]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.colors.gray[200],
  },
  selectedTab: {
    backgroundColor: Colors.colors.primary[200],
    borderColor: Colors.colors.primary[200],
  },
  tabText: {
    ...globalStyles.largeBodyMedium,
    color: Colors.colors.gray[400],
  },
  selectedTabText: {
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.neutral[100],
  },
});

export default FilterTabs;