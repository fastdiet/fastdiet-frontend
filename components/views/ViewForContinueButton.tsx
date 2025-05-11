import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface PaddingViewProps {
  children: React.ReactNode;
}

const ViewForContinueButton: React.FC<PaddingViewProps> = ({ children }) => {
  return <View style={[styles.container]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'space-between'
  } as ViewStyle,
});

export default ViewForContinueButton;