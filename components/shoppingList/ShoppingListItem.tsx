// React and expo imports
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Check } from 'lucide-react-native';

// Models and utils imports
import { ShoppingListItem as ShoppingListItemModel } from '@/models/shoppingList';
import { formatAmount } from '@/utils/clean';

// Style imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';


const INGREDIENT_IMAGE_BASE_URL = "https://img.spoonacular.com/ingredients_100x100/";

interface ShoppingListItemProps {
  item: ShoppingListItemModel;
  isChecked: boolean;
  onToggle: () => void;
  unitSystem: 'metric' | 'us';
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = React.memo(({ item, isChecked, onToggle, unitSystem }) => {
  
  const measure = item.measures?.[unitSystem] || item.measures?.metric || Object.values(item.measures)[0];
  
  const formattedAmount = measure ? formatAmount(measure.amount ?? 0) : formatAmount(item.amount ?? 0);
  const unit = measure?.unit || item.unit || '';

  return (
    <TouchableOpacity onPress={onToggle} style={styles.container} activeOpacity={0.7}>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <Check size={16} color={Colors.colors.neutral[100]} strokeWidth={3} />}
      </View>
      <View style={styles.imageShadowContainer}>
      {item.image_filename ? (
        <Image
          source={{ uri: `${INGREDIENT_IMAGE_BASE_URL}${item.image_filename}` }}
          style={[styles.ingredientImage, isChecked && styles.checkedOpacity]}
        />
      ) : (
        <View style={[styles.ingredientImage, styles.placeholderImage, isChecked && styles.checkedOpacity]}>
          <MaterialCommunityIcons name="food-variant" size={24} color={Colors.colors.gray[300]} />
        </View>
      )}
      </View>
      <View style={styles.ingredientTextContainer}>
        <Text style={[styles.ingredientName, isChecked && styles.ingredientNameChecked]} numberOfLines={2}>
          {item.name}
        </Text>
      </View>

      <Text style={[styles.ingredientQuantity, isChecked && styles.checkedQuantity]}>
        {formattedAmount} {unit}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.colors.gray[100],
  },
  checkbox: { 
    width: 24, 
    height: 24, 
    borderRadius: 6, 
    borderWidth: 2, 
    borderColor: Colors.colors.gray[200], 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  checkboxChecked: { 
    backgroundColor: Colors.colors.primary[200], 
    borderColor: Colors.colors.primary[200] 
  },
  imageShadowContainer: {
    width: 48,
    height: 48,
    marginRight: 16,
    borderRadius: 10,
    shadowColor: "#000",
    backgroundColor: Colors.colors.neutral[100],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  ingredientImage: { 
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: Colors.colors.gray[100],
  },
  placeholderImage: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.colors.gray[100] 
  },
  ingredientTextContainer: { 
    flex: 1, 
    marginRight: 12 
  },
  ingredientName: { 
    ...globalStyles.mediumBodyMedium, 
    color: Colors.colors.gray[500], 
    textTransform: 'capitalize' ,
    lineHeight: 18,
  },
  ingredientNameChecked: { 
    textDecorationLine: 'line-through', 
    color: Colors.colors.gray[400] 
  },
  ingredientQuantity: { 
    ...globalStyles.mediumBodySemiBold,
    color: Colors.colors.gray[400],
    minWidth: 70, 
    textAlign: 'right' 
  },
  checkedOpacity: { 
    opacity: 0.5 
  },
  checkedQuantity:{
    textDecorationLine: 'line-through', 
    color: Colors.colors.gray[400] 
  }
});

export default ShoppingListItem;