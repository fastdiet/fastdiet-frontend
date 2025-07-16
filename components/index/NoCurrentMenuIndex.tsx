// React & React Native Imports
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Component Imports
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PaddingView from '@/components/views/PaddingView';
import TitleParagraph from '@/components/text/TitleParagraph';
import FullScreenLoading from '@/components/FullScreenLoading';
import ErrorText from '@/components/text/ErrorText';

// Hook Imports
import { useAuth } from '@/hooks/useAuth';
import { useMenu } from '@/hooks/useMenu';
import { useTranslation } from 'react-i18next';

// Style Imports
import globalStyles from '@/styles/global';
import { Colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';



const FeatureItem = ({icon, title, description}: {
  icon: any;
  title: string;
  description: string;
})=> (
  <View style={styles.featureContainer}>
    <View style={styles.iconContainer}>
      <FontAwesome 
        name={icon} 
        size={18} 
        color={Colors.colors.primary[100]} 
      />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[globalStyles.largeBodySemiBold, { marginBottom: 2 }]}>
        {title}
      </Text>
      <Text style={globalStyles.mediumBodyRegular}>
        {description}
      </Text>
    </View>
  </View>
);

const SecondaryButton = ({title, onPress, icon,}: {
  title: string;
  onPress: () => void;
  icon?: any;
}) => (
  <TouchableOpacity 
    style={styles.secondaryButton}
    onPress={onPress}
    activeOpacity={0.8}
  >
    {icon && (
      <FontAwesome 
        name={icon} 
        size={16} 
        color={Colors.colors.primary[100]} 
        style={{ marginRight: 8 }}
      />
    )}
    <Text style={[globalStyles.largeBodySemiBold, { color: Colors.colors.primary[100] }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const NoCurrentMenuIndex = () => {
  const router = useRouter();
  const { user} = useAuth();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const {generateMenu}  = useMenu();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMenu = async () => {
    console.log("Generar menu");
    setIsGenerating(true);
    setErrorMessage("");
    const {success, error} = await generateMenu();
    if(!success){
      setErrorMessage(error?.message ?? "");
      setIsGenerating(false);
      return;
    }

    setIsGenerating(false);
  };

  return (
    <View style={styles.container}>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1}}
        >
            <PaddingView>
                    {errorMessage ? <ErrorText text={errorMessage} /> : null}
                    <TitleParagraph
                      title={t('index.noMenu.welcome', { name: user?.name})}
                      paragraph={t('index.noMenu.subtitle')}
                      titleStyle={{ fontSize: 28, lineHeight: 34}}
                      containerStyle={{ marginTop: 16 }}
                    />
                <View style={styles.featuresCard}>
                    <Text style={[globalStyles.subtitle, { color: Colors.colors.primary[100], marginBottom: 10 }]}>
                    {t('index.noMenu.featuresTitle')}
                    </Text>
                    
                    <FeatureItem 
                    icon="check-circle" 
                    title={t('index.noMenu.feature1.title')}
                    description={t('index.noMenu.feature1.description')}
                    />
                    
                    <FeatureItem 
                    icon="cutlery" 
                    title={t('index.noMenu.feature2.title')}
                    description={t('index.noMenu.feature2.description')}
                    />
                    
                    <FeatureItem 
                    icon="refresh" 
                    title={t('index.noMenu.feature3.title')}
                    description={t('index.noMenu.feature3.description')}
                    />
                </View>
                <View style={styles.actionsContainer}>
                    <PrimaryButton 
                    title={t('index.noMenu.generateMenu')}
                    onPress={handleGenerateMenu}
                    style={styles.primaryButton}
                    />
                    
                    <SecondaryButton 
                    title={t('index.noMenu.checkPreferences')}
                    onPress={() => console.log("Revisar o ajustar tus preferencias")}
                    icon="sliders"
                    />
                </View>

                <View style={styles.tipContainer}>
                    <FontAwesome 
                    name="lightbulb-o" 
                    size={24} 
                    color={Colors.colors.accent[100]} 
                    style={{ marginRight: 12 }} 
                    />
                    <Text style={[globalStyles.mediumBodyRegular, styles.tipText]}>
                    {t('index.noMenu.tip')}
                    </Text>
                </View>
                
                <View style={{ height: 24 }} />
            </PaddingView>
      </ScrollView>
      <FullScreenLoading visible={isGenerating} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.colors.neutral[100] 
  },
  
  featuresCard: { 
    marginTop: 32,
    marginVertical: 24,
    
  },
  featureContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  iconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: Colors.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  actionsContainer: { 
    marginTop: 8, 
    marginBottom: 24
  },
  primaryButton: { 
    paddingVertical: 16,
    marginBottom: 12,
  },
  secondaryButton: { 
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.colors.primary[500],
    borderWidth: 2,
    borderColor: Colors.colors.primary[500],
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  },
  tipContainer: { 
    backgroundColor: Colors.colors.accent[400],
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.colors.accent[100]
  },
  tipText: { 
    flex: 1, 
    color: Colors.colors.gray[500]
  }
});

export default NoCurrentMenuIndex;