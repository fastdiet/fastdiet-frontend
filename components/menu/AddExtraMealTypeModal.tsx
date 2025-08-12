import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native';

import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { getMealIcon } from '@/components/menu/MealCard';

interface AddExtraMealTypeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
}

const extraMealTypes = [
  { key: 'snack', labelKey: 'constants.meals.snack' },
  { key: 'dessert', labelKey: 'constants.meals.dessert' },
  { key: 'salad', labelKey: 'constants.meals.salad' },
  { key: 'beverage', labelKey: 'constants.meals.beverage' },
  { key: 'appetizer', labelKey: 'constants.meals.appetizer' },
];

const AddExtraMealTypeModal: React.FC<AddExtraMealTypeModalProps> = ({ isVisible, onClose, onSelectType }) => {
  const { t } = useTranslation();

  const handleSelect = (type: string) => {
    onSelectType(type);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalView} >
          <View style={styles.header}>
            <Text style={styles.modalTitle} numberOfLines={2} >{t('index.menu.addExtraMealModal.title')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.colors.gray[500]} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={extraMealTypes}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
              const IconComponent = getMealIcon(item.key);

              return (
                <Pressable 
                  style={({ pressed }) => [styles.typeButton, pressed && styles.typeButtonPressed]} 
                  onPress={() => handleSelect(item.key)}
                >
                  <View style={styles.iconContainer}>
                    <IconComponent color={Colors.colors.primary[100]} size={22} />
                  </View>
                  <Text style={styles.typeButtonText}>{t(item.labelKey)}</Text>
                </Pressable>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    ...globalStyles.titleMedium,
    color: Colors.colors.gray[700],
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 6, 
    borderRadius: 99,
    backgroundColor: Colors.colors.gray[100]
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 16,
  },
  typeButtonPressed: {
    backgroundColor: Colors.colors.gray[100],
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonText: {
    ...globalStyles.largeBody,
    color: Colors.colors.primary[100],
    fontFamily: 'InterSemiBold'
  },
  separator: {
    height: 1,
    backgroundColor: Colors.colors.gray[200],
    marginVertical: 6,
  },
});

export default AddExtraMealTypeModal;