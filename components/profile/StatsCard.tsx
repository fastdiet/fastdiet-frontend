import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface StatsCardProps {
  label: string;
  value: string;
  onPress?: () => void;
}

const StatsCard = ({ label, value, onPress }: StatsCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    minHeight: 90,
  },
  value: {
    ...globalStyles.titleLarge,
    color: Colors.colors.primary[100],
    textAlign: 'center'
  },
  label: {
    ...globalStyles.smallBodyRegular,
    color: Colors.colors.gray[400],
    textAlign: 'center',
    marginTop: 4,
  },
});

export default StatsCard;