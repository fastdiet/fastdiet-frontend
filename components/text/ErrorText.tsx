// React & React Native Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Style Imports
import { Colors } from '@/constants/Colors';

interface ErrorTextProps {
  text: string; 
}

const ErrorText: React.FC<ErrorTextProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10, 
    paddingHorizontal: 10,
    backgroundColor: Colors.colors.error[400], 
    borderRadius: 5,
  },
  text: {
    color: Colors.colors.error[100],
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ErrorText;
