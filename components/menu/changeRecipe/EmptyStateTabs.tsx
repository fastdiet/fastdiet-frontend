import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import globalStyles from '@/styles/global';
import { Colors } from '@/constants/Colors';
import { BookOpen, Plus } from 'lucide-react-native';
import PrimaryButton from '@/components/buttons/PrimaryButton';

interface EmptyStateTabsProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  cta?: {
    title: string;
    onPress: () => void;
  };
}

const EmptyStateTabs: React.FC<EmptyStateTabsProps> = ({ icon, title, subtitle, cta  }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        {icon ? icon : <BookOpen size={40} color={Colors.colors.primary[200]} strokeWidth={1} />}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      
      {cta && (
        <PrimaryButton 
          title={cta.title}
          onPress={cta.onPress}
          style={{ marginTop: 24, paddingHorizontal: 32 }}
          leftIcon={<Plus size={20} strokeWidth={2.5} color={Colors.colors.neutral[100]} />}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: Colors.colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.colors.primary[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...globalStyles.titleMedium,
    color: Colors.colors.gray[500],
    textAlign: 'center',
  },
  subtitle: {
    ...globalStyles.mediumBodyRegular,
    color: Colors.colors.gray[400],
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '90%',
  },
});

export default EmptyStateTabs;