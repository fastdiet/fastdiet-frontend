// React & React Native Imports
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';

// Style Imports
import globalStyles from '@/styles/global';

interface TitleParagraphProps {
  title: string;
  paragraph: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const TitleParagraph: React.FC<TitleParagraphProps> = ({ title, paragraph,containerStyle, titleStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[globalStyles.title, styles.title, titleStyle]}>{title}</Text>
      <Text style={[globalStyles.largeBodyMedium, styles.paragraph]}>{paragraph}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center', 
  },
  paragraph: {
    textAlign: 'center', 
  },
});

export default TitleParagraph;

