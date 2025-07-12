// React and expo imports
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = React.memo(({ title, children, iconName, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={toggleOpen} style={styles.sectionHeader} activeOpacity={0.7}>
        {iconName && <MaterialCommunityIcons name={iconName} size={22} color={Colors.colors.primary[100]} style={styles.sectionIcon} />}
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} size={26} color={Colors.colors.gray[300]} />
      </TouchableOpacity>
      {isOpen && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
});

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 12,
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[100],
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    ...globalStyles.subtitle,
    color: Colors.colors.primary[100],
    flex: 1,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
});

export default Section;