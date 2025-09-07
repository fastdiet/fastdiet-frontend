import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';

interface CustomToastProps {
  text1?: string;
  text2?: string;
  props: any;
}

const SuccessToast = ({ text1, text2 }: CustomToastProps) => (
  <View style={[styles.base, styles.successBase]}>
   <CheckCircle size={24} color={Colors.colors.success[100]} style={styles.icon} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.text1}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  </View>
);

const InfoToast = ({ text1, text2 }: CustomToastProps) => (
  <View style={[styles.base, styles.infoBase]}>
    <Info size={24} color={Colors.colors.accent[100]} style={styles.icon} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.text1}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  </View>
);


const ErrorToastCustom = ({ text1, text2 }: CustomToastProps) => (
  <View style={[styles.base, styles.errorBase]}>
    <AlertCircle size={24} color={Colors.colors.error[100]} style={styles.icon} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.text1}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  </View>
);

const toastConfig = {
  success: (props: CustomToastProps) => <SuccessToast {...props} />,
  error: (props: CustomToastProps) => <ErrorToastCustom {...props} />,
  info: (props: CustomToastProps) => <InfoToast {...props} />,
};

export const AppToast = () => {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 68;

  return (
    <Toast 
      config={toastConfig}
      position='bottom'
      bottomOffset={insets.bottom + TAB_BAR_HEIGHT + 10}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    width: '90%',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  successBase: {
    backgroundColor: Colors.colors.success[400]
  },
  errorBase: {
    backgroundColor: Colors.colors.error[400]
  },
  infoBase: {
    backgroundColor: Colors.colors.accent[400]
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    ...globalStyles.largeBodySemiBold,
  },
  text2: {
    ...globalStyles.mediumBodyRegular,
    lineHeight: 18,
    marginTop: 4,
    opacity: 0.9,
  },
});