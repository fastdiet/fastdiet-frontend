import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface FABProps {
  onPress: () => void;
}

const FloatingActionButton = ({ onPress }: FABProps) => (
  <TouchableOpacity style={styles.fab} onPress={onPress}>
    <Ionicons name="add" size={32} color={Colors.colors.neutral[100]} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 90, // Lo subimos para que no interfiera con la tab bar
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.colors.primary[200],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default FloatingActionButton;