import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import globalStyles from '@/styles/global';
import { Colors } from '@/constants/Colors';

interface Props {
  title: string;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
}

const SectionHeader = ({ title, iconName }: Props) => {
  return (
    <View style={styles.container}>
      {iconName && <MaterialCommunityIcons name={iconName} size={22} color={Colors.colors.primary[100]} />}
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