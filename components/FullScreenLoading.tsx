// React and expo imports
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Modal, Text, ActivityIndicator, StyleSheet, Platform, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface FullScreenLoadingProps {
  visible: boolean;
  textKey?:string;
  lottieAnimationSource?: any;
  disableDynamicText?: boolean;
  dynamicTextInterval?: number;
}

const DEFAULT_LOTTIE_ANIMATION = require('@/assets/animations/loading-generating-menu.json');
const { width: screenWidth } = Dimensions.get('window');

const LOADING_KEYS = [
  'index.noMenu.loading.preparingKitchen',
  'index.noMenu.loading.sharpeningKnives',
  'index.noMenu.loading.cookingIdeas',
  'index.noMenu.loading.creatingMenu',
  'index.noMenu.loading.platingOptions',
  'index.noMenu.loading.almostReady',
];

const FullScreenLoading = ({ visible, textKey, lottieAnimationSource = DEFAULT_LOTTIE_ANIMATION, disableDynamicText = false, dynamicTextInterval = 3000 }: FullScreenLoadingProps) => {
  const { t } = useTranslation();
  const messages = useMemo(() => (
    textKey ? [t(textKey)] : LOADING_KEYS.map(key => t(key))
  ), [textKey, t]);

  const [messageIndex, setMessageIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible || messages.length <= 1 || disableDynamicText) return;

    setMessageIndex(0);
    intervalRef.current = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, dynamicTextInterval);

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [visible, messages, disableDynamicText, dynamicTextInterval]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {lottieAnimationSource ? (
            <LottieView
              source={lottieAnimationSource}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          ) : (
            <ActivityIndicator 
              size="large" 
              color={Colors.colors.primary[100]} 
              style={styles.spinner}
            />
          )}
          <View style={styles.textContainer}>
            <Text style={[globalStyles.mediumBodyRegular, styles.text]}>
              {messages[messageIndex]}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  activityIndicatorWrapper: {
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 16,
    width: screenWidth * 0.8,
    minWidth: 250,
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    ...Platform.select({
      ios: {
        shadowColor: Colors.colors.neutral[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  lottieAnimation: {
    width: 100,
    height: 100,
    marginBottom: 10, 
  },
  textContainer: {
    width: '100%',
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginTop: 10,
    color: Colors.colors.gray[500],
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  spinner:{
    marginBottom: 15
  }
});

export default FullScreenLoading;