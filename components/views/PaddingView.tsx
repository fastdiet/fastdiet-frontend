// React & React Native Imports
import React from 'react';
import { View, StyleSheet } from 'react-native';



interface PaddingViewProps {
  children: React.ReactNode;
}

const PaddingView: React.FC<PaddingViewProps> = ({ children }) => {
  return <View style={[styles.container]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, 
    paddingTop: 16,
    flex: 1
  },
  
});

export default PaddingView;
