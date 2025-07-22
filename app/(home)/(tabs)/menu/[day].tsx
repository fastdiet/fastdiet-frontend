// React and Expo imports
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useLocalSearchParams, useNavigation} from 'expo-router'; 

// Components imports
import DayMenuScreen from '@/components/menu/DayMenuScreen';

// Hooks imports
import { useMenu } from '@/hooks/useMenu';
import { useTranslation } from 'react-i18next';

// Constans imports
import { daysOrder } from '@/constants/days';

// Style imports
import globalStyles from '@/styles/global';
import { Colors } from '@/constants/Colors';
import { AlertCircle } from 'lucide-react-native';
import { RecipeShort } from '@/models/mealPlan';


const DayMenuPagerScreen = () => {
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const { day: dayParam } = useLocalSearchParams<{ day: string }>();
  const {menu, loading} = useMenu();
  const { t } = useTranslation();

  let parsedInitialDayIndex = Number(dayParam);
  if (!Number.isInteger(parsedInitialDayIndex)) parsedInitialDayIndex = daysOrder[0];
  if (isNaN(parsedInitialDayIndex) || parsedInitialDayIndex < 0 || parsedInitialDayIndex >= daysOrder.length) {
    parsedInitialDayIndex = daysOrder[0];
  }

  const [index, setIndex] = useState(parsedInitialDayIndex);

  const routes = useMemo(() =>
    daysOrder.map(dayIdx => ({
      key: `day_${dayIdx}`,
      title: t(`constants.days.${dayIdx}`),
      dayIndex: dayIdx,
    })), [t]);

  useEffect(() => {
    if (index >= 0 && index < routes.length) {
      const currentDayObject = routes[index];
      if (currentDayObject) {
        navigation.setOptions({ title: currentDayObject.title });
      }
    }
  }, [index, routes, navigation, t]);

  const renderScene = useMemo(() => SceneMap(
    daysOrder.reduce((acc, dayIdx) => {
      acc[`day_${dayIdx}`] = () => {
        const dayData = menu?.days.find(day => day.day === dayIdx)?.meals || null;
        return <DayMenuScreen dayData={dayData} dayIndex={dayIdx} />;
      };
      return acc;
    }, {} as { [key: string]: React.ComponentType<any> })
  ), [menu]);

  const renderTabBar = () => null;

  if (loading && !menu) { 
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color={Colors.colors.primary[400]} />
        <Text style={[globalStyles.mediumBodyRegular, styles.messageText]}>{t("index.menu.loading")}</Text>
      </View>
    );
  }

  if (!routes || routes.length === 0 || index < 0 || index >= routes.length || !routes[index]) {
    return (
      <View style={[styles.centeredContainer, styles.errorContainer]}>
        <AlertCircle size={56} color={Colors.colors.error[100]} strokeWidth={1.5} />
        <Text style={styles.errorTitle}>{t("index.menu.error.invalidDayTitle")}</Text>
        <Text style={styles.errorMessage}>{t("index.menu.error.invalidDayMessage")}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t("index.menu.error.goBack")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(newIndex) => {
          if (newIndex >= 0 && newIndex < routes.length) {
            setIndex(newIndex);
          }
        }}
        initialLayout={{ width: layout.width, height: 0 }}
        renderTabBar={renderTabBar}
        lazyPreloadDistance={1}
      />
    </>
  );
};

const styles = StyleSheet.create({
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    marginTop: 10,
    textAlign: 'center',
  },
  centeredContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: Colors.colors.neutral[100],
},
errorContainer: {
  padding: 24,
},
errorTitle: {
  marginTop: 16,
  textAlign: 'center',
  ...globalStyles.largeBodyBold,
  color: Colors.colors.gray[500],
},
errorMessage: {
  marginVertical: 12,
  textAlign: 'center',
  ...globalStyles.mediumBodyRegular,
  color: Colors.colors.gray[400],
  lineHeight: 20,
},
retryButton: {
  marginTop: 16,
  backgroundColor: Colors.colors.primary[100],
  paddingVertical: 14,
  paddingHorizontal: 28,
  borderRadius: 8,
},
retryButtonText: {
  ...globalStyles.mediumBodySemiBold,
  color: Colors.colors.neutral[100],
},
});

export default DayMenuPagerScreen;