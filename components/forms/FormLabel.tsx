import { Text, StyleSheet } from 'react-native';
import globalStyles from '@/styles/global';
import { Colors } from '@/constants/Colors';

interface FormLabelProps {
  text: string;
}

const FormLabel = ({ text }: FormLabelProps) => {
  return <Text style={styles.label}>{text}</Text>;
};

const styles = StyleSheet.create({
  label: {
    ...globalStyles.smallBodySemiBold,
    color: Colors.colors.gray[500],
    marginBottom: 4,
    marginLeft: 4,
  },
});

export default FormLabel;