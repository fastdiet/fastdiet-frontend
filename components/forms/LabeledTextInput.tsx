import { View, TextInputProps } from 'react-native';
import FormLabel from '@/components/forms/FormLabel';
import StyledTextInput from '@/components/forms/StyledTextInput';


interface LabeledTextInputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
}

const LabeledTextInput = ({ label, errorMessage, ...props }: LabeledTextInputProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormLabel text={label} />
      <StyledTextInput
        errorMessage={errorMessage}
        {...props}
      />
    </View>
  );
};

export default LabeledTextInput;