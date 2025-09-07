// React and Expo imports
import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { Check, ListTodo, ShoppingCart, RefreshCw, Share2, ArrowUp } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

// Components imports
import TitleParagraph from '@/components/text/TitleParagraph';
import PaddingView from '@/components/views/PaddingView';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import ShoppingListItem from '@/components/shoppingList/ShoppingListItem';
import Section from '@/components/ui/Section';
import FullScreenLoading from '@/components/FullScreenLoading';
import ServingsModal from '@/components/shoppingList/ServingsModal';

// Hooks, Styles, and Models
import { useShoppingList } from '@/hooks/useShoppingList';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { getAisleInfo } from '@/constants/aisles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMenu } from '@/hooks/useMenu';
import Toast from 'react-native-toast-message';
import { getLogoBase64 } from '@/utils/imageToBase64';
import { generatePdfHtml } from '@/utils/pdfGenerator';
import { useAuth } from '@/hooks/useAuth';
import { getWeekDateRange } from '@/utils/dates';




const ShoppingListScreen = () => {
  const { t } = useTranslation();
  const { shoppingList, loading, generateList } = useShoppingList();
  const { user } = useAuth();
  const { menu } = useMenu();
  const [isSharing, setIsSharing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [unitSystem, setUnitSystem] = useState<'metric' | 'us'>('metric');
  const [isServingsModalVisible, setServingsModalVisible] = useState(false);
  const [servingsToGenerate, setServingsToGenerate] = useState<number | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 68;

  const hasSwitchableUnits = useMemo(() =>
    shoppingList?.aisles.some(aisle =>
      aisle.items.some(item => item.measures.metric && item.measures.us)
    ) ?? false,
  [shoppingList]);

  const handleToggleItem = (ingredientKey: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientKey)) newSet.delete(ingredientKey);
      else newSet.add(ingredientKey);
      return newSet;
    });
  };

  const handleGenerateShoppingList = () => {
    console.log("lista")
    if(!menu){
      Toast.show({
        type: "info",
        text1: t("shoppingList.noMenu.title"),
        text2: t("shoppingList.noMenu.subtitle"),
      });
    }else{
      setServingsModalVisible(true)
    }
  }

  const handleConfirmGeneration = (servings: number) => {
    setServingsModalVisible(false);
    setServingsToGenerate(servings);
  };

  useEffect(() => {
    if (servingsToGenerate !== null) {
      console.log(`Generating shopping list for ${servingsToGenerate} servings.`);
      generateList(servingsToGenerate);
      setServingsToGenerate(null);
    }
  }, [servingsToGenerate]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 350) {
      setShowScrollTopButton(true);
    } else {
      setShowScrollTopButton(false);
    }
  };

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleClearChecked = () => setCheckedItems(new Set());

  const handleShare = async () => {
    if (!shoppingList) return;
    setIsSharing(true);
    try {
      const logoBase64 = await getLogoBase64();
      const menuDates = getWeekDateRange();
      const html = generatePdfHtml({
        shoppingList,
        logoBase64,
        t,
        unitSystem,
        userName: user?.name || '',
        menuDates: menuDates
      });

      const { uri: tempUri } = await Print.printToFileAsync({ html, base64: false });
      console.log('File has been saved to:', tempUri);
      const date = new Date();
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      const filename = t('shoppingList.pdf.filename', { date: formattedDate, defaultValue: `Shopping-List-FastDiet-${formattedDate}.pdf` });
    
      const newUri = `${FileSystem.cacheDirectory}${filename}`;
       await FileSystem.moveAsync({
        from: tempUri,
        to: newUri,
      });

      if (!(await Sharing.isAvailableAsync())) {
        Toast.show({ type: 'info', text1: t('sharing.notAvailable') });
        setIsSharing(false);
        return;
      }
      await Sharing.shareAsync(newUri, {
        dialogTitle: t('shoppingList.shareTitle'),
        mimeType: 'application/pdf',
        UTI: '.pdf',
      });

    } catch (error) {
      console.error("Error sharing PDF:", error);
      Toast.show({
        type: 'error',
        text1: t('errorsFrontend.shareFailedTitle'),
        text2: t('errorsFrontend.shareFailedSubtitle'),
      });
    } finally {
      console.log("Cleaning up sharing state");
      setIsSharing(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.centeredContainer}>
      <View style={styles.iconCircle}><ShoppingCart size={50} color={Colors.colors.primary[200]} strokeWidth={1.5} /></View>
      <Text style={styles.emptyStateTitle}>{t('shoppingList.empty.title')}</Text>
      <Text style={styles.emptyStateText}>{t('shoppingList.empty.subtitle')}</Text>
      <PrimaryButton
        title={t('shoppingList.cta.generate')} onPress={handleGenerateShoppingList}
        style={{ marginTop: 24, paddingHorizontal: 32 }}
        leftIcon={<ListTodo size={20} color={Colors.colors.neutral[100]} />}
      />
      <ServingsModal
        visible={isServingsModalVisible}
        onClose={() => setServingsModalVisible(false)}
        onConfirm={handleConfirmGeneration}
      />
    </View>
  );
  
  return (
    <View style={styles.outerContainer}> 
     {(shoppingList && shoppingList.aisles.length > 0) ? (
      <ScrollView 
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        ref={scrollViewRef}
        onScroll={handleScroll}
      >
        <PaddingView>
          <TitleParagraph
            title={t('shoppingList.title')}
            paragraph={t('shoppingList.subtitle')}
            containerStyle={{ marginTop: 16, marginBottom: 24 }}
          />
          <View style={styles.actionsBar}>
            {hasSwitchableUnits && (
              <SegmentedControlTab
                values={[t('recipes.units.metric'), t('recipes.units.imperial')]}
                selectedIndex={unitSystem === 'metric' ? 0 : 1}
                onTabPress={(index) => setUnitSystem(index === 0 ? 'metric' : 'us')}
                tabsContainerStyle={styles.tabsContainerStyle}
                tabStyle={styles.tabStyle}
                activeTabStyle={styles.activeTabStyle}
                tabTextStyle={styles.tabTextStyle}
                activeTabTextStyle={styles.activeTabTextStyle}
              />
            )}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={handleGenerateShoppingList} style={styles.actionButton} disabled={isSharing}>
                <RefreshCw size={22} color={loading ? Colors.colors.gray[300] : Colors.colors.primary[200]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                <Share2 size={22} color={Colors.colors.primary[200]} />
              </TouchableOpacity>
            </View>
          </View>
          
        </PaddingView>

        {shoppingList.aisles.map(aisle => {
          const { name: translatedAisleName, icon } = getAisleInfo(aisle.aisle, t);
          return(
            <View key={aisle.aisle} style={styles.sectionWrapper}>
              <Section 
                title={translatedAisleName} 
                icon={icon}
                defaultOpen={false}
                contentStyle={{ paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }}
              >
                {aisle.items.map((item, index) => (
                  <ShoppingListItem
                    key={`${item.ingredientId}-${index}`}
                    item={item}
                    isChecked={checkedItems.has(`${item.ingredientId}-${index}`)}
                    onToggle={() => handleToggleItem(`${item.ingredientId}-${index}`)}
                    unitSystem={unitSystem}
                  />
                ))}
              </Section>
            </View>
          );
        })}

        {checkedItems.size > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearChecked}>
            <Check size={16} color={Colors.colors.primary[200]}/>
            <Text style={styles.clearButtonText}>{t('shoppingList.clearChecked')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      ) : (
        renderEmptyState()
      )}
      {showScrollTopButton && (
        <TouchableOpacity style={[styles.scrollTopButton, {bottom: insets.bottom + TAB_BAR_HEIGHT + 20,}]} onPress={handleScrollToTop}>
          <ArrowUp size={24} color={Colors.colors.neutral[100]} />
        </TouchableOpacity>
      )}

      <FullScreenLoading
        visible={loading || isSharing}
        mode="shoppingList"
      />
      
      <ServingsModal
        visible={isServingsModalVisible}
        onClose={() => setServingsModalVisible(false)}
        onConfirm={handleConfirmGeneration}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.colors.gray[100],
  },
  scrollContentContainer: {
    paddingBottom: 150,
  },
  sectionWrapper: {
    paddingHorizontal: 16,
  },
  centeredContainer: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.colors.gray[100], 
    paddingHorizontal: 24 
  },
  iconCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: Colors.colors.neutral[100], 
    borderWidth: 1, 
    borderColor: Colors.colors.primary[200], 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  emptyStateTitle: { 
    ...globalStyles.titleMedium, 
    color: Colors.colors.gray[900], 
    textAlign: 'center' 
  },
  emptyStateText: { 
    ...globalStyles.largeBody, 
    color: Colors.colors.gray[500], 
    textAlign: 'center', 
    marginTop: 8, 
    maxWidth: '95%' 
  },
  clearButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 12, 
    marginTop: 24
  },
  clearButtonText: { 
    ...globalStyles.largeBodySemiBold, 
    color: Colors.colors.primary[200], 
    marginLeft: 8 
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.colors.gray[200],
  },

  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tabsContainerStyle: { 
    height: 38, 
    flex: 1,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: Colors.colors.neutral[100],
  },
  tabStyle: { 
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  activeTabStyle: { 
    backgroundColor: Colors.colors.primary[100], 
    borderRadius: 6
  },
  tabTextStyle: { 
    ...globalStyles.largeBodyMedium,
    color: Colors.colors.gray[400] 
  },
  activeTabTextStyle: {
    ...globalStyles.largeBodyMedium,
    color: Colors.colors.neutral[100]
  },
  scrollTopButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: Colors.colors.primary[200],
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2,},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
});

export default ShoppingListScreen;