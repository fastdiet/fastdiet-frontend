import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import globalStyles from '@/styles/global';
import { Colors } from '@/constants/Colors';
import { Inbox } from 'lucide-react-native';

interface EmptyStateTabsProps {
  icon?: React.ReactNode;
  message: string;
}

const EmptyStateTabs: React.FC<EmptyStateTabsProps> = ({ icon, message }) => {
  return (
    <View style={styles.container}>
      {icon ? icon : <Inbox size={48} color={Colors.colors.gray[300]} />}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    ...globalStyles.largeBody,
    color: Colors.colors.gray[400],
    marginTop: 16,
    textAlign: 'center',
  },
});

export default EmptyStateTabs;