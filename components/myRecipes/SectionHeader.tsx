import { View, Text, StyleSheet } from 'react-native';
import globalStyles from '@/styles/global';
import { Colors } from '@/constants/Colors';
import { LucideIcon } from 'lucide-react-native';

interface Props {
  title: string;
  iconComponent?: LucideIcon
}

const SectionHeader = ({ title, iconComponent: Icon }: Props) => {
  return (
    <View style={styles.container}>
      {Icon && <Icon size={22} color={Colors.colors.primary[100]} />}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.colors.gray[200],
    marginTop: 24,
  },
  title: {
    ...globalStyles.titleMedium,
    color: Colors.colors.gray[700],
    marginLeft: 12,
  }
});

export default SectionHeader;