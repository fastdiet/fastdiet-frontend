import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '@/styles/global';
import { Colors } from '@/constants/Colors';

interface Props {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const SectionHeader = ({ title, iconName }: Props) => {
  return (
    <View style={styles.container}>
      {iconName && <Ionicons name={iconName} size={22} color={Colors.colors.primary[200]} />}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[200],
    marginBottom: 20,
    marginTop: 24,
  },
  title: {
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.gray[500],
    marginLeft: 8,
  }
});

export default SectionHeader;