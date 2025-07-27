import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import PrimaryButton from '../buttons/PrimaryButton';


interface ErrorDetails {
  errorTitle: string;
  errorMessage: string | null;
  notFoundTitle: string;
  onRetry: () => void;
}

interface RecipePageStatusProps {
  status: 'loading' | 'error';
  errorDetails?: ErrorDetails;
}

const RecipePageStatus: React.FC<RecipePageStatusProps> = ({ status, errorDetails }) => {
  const { t } = useTranslation();

  if (status === 'loading') {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.colors.primary[200]} />
        <Text style={[globalStyles.mediumBodySemiBold, styles.messageText]}>
          {t("recipes.detailLoading")} 
        </Text>
      </View>
    );
  }

  if (status === 'error' && errorDetails) {
    return (
      <>
        <Stack.Screen options={{ title: errorDetails.notFoundTitle }} />
        <View style={styles.centeredContainer}>
          <AlertCircle size={56} color={Colors.colors.error[100]} strokeWidth={1.5} />
          <Text style={styles.errorTitle}>{errorDetails.errorTitle}</Text>
          <Text style={styles.errorMessage}>
            {errorDetails.errorMessage || t("myRecipes.detail.couldNotLoad")}
          </Text>
          <PrimaryButton title={t("retry")} onPress={errorDetails.onRetry} style={{ marginTop: 24, paddingHorizontal: 32 }}/>
        </View>
      </>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  messageText: {
    marginTop: 10,
    color: "#333",
  },
  errorTitle: {
    marginTop: 16,
    textAlign: 'center',
    ...globalStyles.headlineSmall,
    color: Colors.colors.gray[900],
  },
  errorMessage: {
    marginVertical: 8,
    textAlign: 'center',
    ...globalStyles.largeBody,
    color: Colors.colors.gray[500],
    lineHeight: 22,
  },
});

export default RecipePageStatus;
