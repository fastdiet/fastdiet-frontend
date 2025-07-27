
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";


// Style Imports
import globalStyles from "@/styles/global";

// Utility Imports
import { Colors } from "@/constants/Colors";

// Icon Imports
import ViewInputs from "@/components/views/ViewInputs";
import { Check } from "lucide-react-native";

interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

interface RadioButtonProps {
  options: RadioOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const StyledRadioButtonList: React.FC<RadioButtonProps> = ({
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <ViewInputs>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioContainer,
              isSelected && styles.selected,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <View style={[styles.radioCircle, isSelected && styles.checkedCircle]}>
              {isSelected && <Check size={16} color={Colors.colors.neutral[100]} />}
            </View>
            <View style={styles.textContainer}>
              <Text style={[
                globalStyles.largeBodySemiBold,
              ]}>
                {option.label}
              </Text>
              {option.description && (
                <Text style={[globalStyles.mediumBodyRegular, styles.description]}>
                  {option.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ViewInputs>
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderColor: Colors.colors.gray[200],
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: Colors.colors.gray[100],
    paddingHorizontal: 10,
  },
  selected: {
    borderColor: Colors.colors.primary[200],
    backgroundColor: Colors.colors.primary[500],
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.colors.gray[400],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkedCircle: {
    backgroundColor: Colors.colors.primary[200],
    width: 24,
    height: 24,
    borderRadius: 100,
    borderColor: Colors.colors.primary[100],
  },
  textContainer: {
    flex: 1,
    paddingRight: 20, 
  },
  description: {
    color: Colors.colors.gray[500],
  },
});

export default StyledRadioButtonList;