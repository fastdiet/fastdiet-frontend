import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { X, Plus, Minus } from 'lucide-react-native';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ServingsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (servings: number) => void;
}

const ServingsModal: React.FC<ServingsModalProps> = ({ visible, onClose, onConfirm }) => {
  const [servings, setServings] = useState(1);
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm(servings);
  };
  
  const increment = () => setServings(s => s + 1);
  const decrement = () => setServings(s => (s > 1 ? s - 1 : 1));

  const handleModalClose = () => {
    onClose();
    setServings(1);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleModalClose}
    >
      <Pressable style={styles.overlay} onPress={handleModalClose}>
        <Pressable style={styles.modalView}> 
          <View style={styles.header}>
            <Text style={styles.modalTitle}>{t("shoppingList.servingsModal.title")}</Text>
            <Pressable onPress={handleModalClose} style={styles.closeButton}>
              <X size={24} color={Colors.colors.gray[500]} />
            </Pressable>
          </View>
          
         <Text style={styles.modalText}>
            {t("shoppingList.servingsModal.text")}
          </Text>
          <Text style={styles.modalSubText}>
            {t("shoppingList.servingsModal.subText")}
          </Text>
          

          <View style={styles.stepperContainer}>
            <Pressable onPress={decrement} style={({ pressed }) => [styles.stepperButton, pressed && styles.stepperButtonPressed]}>
              <Minus size={24} color={Colors.colors.primary[100]} />
            </Pressable>
            <Text style={styles.stepperValue}>{servings}</Text>
            <Pressable onPress={increment} style={({ pressed }) => [styles.stepperButton, pressed && styles.stepperButtonPressed]}>
              <Plus size={24} color={Colors.colors.primary[100]} />
            </Pressable>
          </View>

          <PrimaryButton
            title={t("shoppingList.servingsModal.generate")}
            onPress={handleConfirm}
            style={{ marginTop: 24, width: '100%' }}
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
        width: '90%',
        maxWidth: 380,
        backgroundColor: Colors.colors.neutral[100],
        borderRadius: 24,
        padding: 24,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        ...globalStyles.titleMedium,
        color: Colors.colors.gray[700],
        flex: 1,
    },
    closeButton: {
        padding: 6,
        borderRadius: 99,
        backgroundColor: Colors.colors.gray[100]
    },
    modalText: {
        ...globalStyles.largeBody,
        color: Colors.colors.gray[700],
        lineHeight: 22,
        marginBottom: 8,
    },
    modalSubText: {
        ...globalStyles.mediumBodyRegular,
        color: Colors.colors.gray[400],
        lineHeight: 18,
    },
    stepperContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
        marginBottom: 16,
        gap: 20,
    },
    stepperButton: {
        width: 52,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 26,
        backgroundColor: Colors.colors.primary[600],
        // Sombra para dar profundidad
        shadowColor: Colors.colors.primary[100],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    stepperButtonPressed: {
      transform: [{ translateY: 1 }]
    },
    stepperValue: {
        ...globalStyles.titleLarge,
        fontFamily: 'InterBold',
        color: Colors.colors.gray[700],
        minWidth: 50,
        textAlign: 'center',
    },
});

export default ServingsModal;