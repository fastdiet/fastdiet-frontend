// React and expo imports
import React, { useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

// Utils imports
import { getShortSummary } from '@/utils/clean';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface RecipeHeaderProps {
  imageUrl?: string | null;
  title: string;
  summary?: string | null;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = React.memo(({ imageUrl, title, summary }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const cleanedSummary = useMemo(() => getShortSummary(summary || "", 2), [summary]);

  return (
    <>
      <View style={styles.imageContainer}>
        {imageLoading && <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={Colors.colors.primary[100]} />}
        <Image
          source={imageUrl ? { uri: imageUrl } : require('@/assets/images/recipe-placeholder.jpg')}
          style={styles.recipeImage}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
      </View>
      
      <View style={{paddingHorizontal: 16 }}>
        <Text style={[styles.title, { marginBottom: cleanedSummary ? 12 : 0 }]}>{title}</Text>
        {cleanedSummary && (
          <Text style={styles.summaryText}>{cleanedSummary}</Text>
        )}
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.colors.gray[100],
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    ...globalStyles.title,
    color: Colors.colors.gray[500],
    marginTop: 24,
  },
  summaryText: {
    ...globalStyles.mediumBodyRegular,
    color: Colors.colors.gray[500],
    lineHeight: 22,
    textAlign: 'left',
  },
});

export default RecipeHeader;