// React and expo imports
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { ChevronDown, ChevronUp, Icon, LucideIcon } from 'lucide-react-native';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon | string; 
  defaultOpen?: boolean;
  contentStyle?: ViewStyle;
}

const Section: React.FC<SectionProps> = React.memo(({ title, children, icon: Icon, defaultOpen = false, contentStyle }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={toggleOpen}  style={[
          styles.sectionHeader,
          isOpen ? styles.sectionHeaderOpen : styles.sectionHeaderClosed
        ]} activeOpacity={0.7}>
        {Icon && (
          typeof Icon === 'string' 
            ? <Text style={styles.emojiIcon}>{Icon}</Text> 
            : <Icon size={22} color={Colors.colors.primary[100]} strokeWidth={2.3} style={styles.sectionIcon} />
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
        {isOpen ? (
          <ChevronUp size={26} color={Colors.colors.gray[300]} />
        ) : (
          <ChevronDown size={26} color={Colors.colors.gray[300]} />
        )}
      </TouchableOpacity>
      {isOpen && <View style={[styles.sectionContent, contentStyle]}>{children}</View>}
    </View>
  );
});

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
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
  sectionHeaderOpen: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[100],
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  sectionHeaderClosed: {
    borderBottomWidth: 0,
  },
  sectionIcon: {
    marginRight: 12,
  },
  emojiIcon: {
    fontSize: 22,
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