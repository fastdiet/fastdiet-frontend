import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecipeDetail } from '@/models/mealPlan'; // Usamos tu modelo existente
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { useTranslation } from 'react-i18next';
import { useMyRecipes } from '@/hooks/useMyRecipes';
import Toast from 'react-native-toast-message';

interface MyRecipeCardProps {
  recipe: RecipeDetail;
  onEdit: (id: number) => void;
}

const MyRecipeCard = ({ recipe, onEdit }: MyRecipeCardProps) => {
    const { t } = useTranslation();
    const { deleteRecipe } = useMyRecipes();

    const handleDelete = () => {
        Alert.alert(
            t('myRecipes.delete.confirmTitle'),
            t('myRecipes.delete.confirmMessage', { title: recipe.title }),
            [
              { text: t('cancel'), style: 'cancel' },
              {
                text: t('delete'),
                style: 'destructive',
                onPress: async () => {
                  const { success, error } = await deleteRecipe(recipe.id);
                  if (success) {
                    Toast.show({ type: 'success', position: 'bottom', text1: t('myRecipes.delete.success') });
                  } else {
                    Toast.show({ type: 'error', position: 'bottom', text1: t('error'), text2: error });
                  }
                },
              },
            ]
          );
    };


  return (
    <View style={styles.card}>
       <Image
                source={recipe.image_url ? { uri: recipe.image_url } : require('@/assets/images/loginFastdiet.png')}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{recipe.title}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {recipe.summary || t('myRecipes.card.noDescription')}
                </Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => onEdit(recipe.id)} style={styles.actionButton}>
                    <Ionicons name="pencil" size={22} color={Colors.colors.primary[200]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={[styles.actionButton, { marginTop: 12 }]}>
                    <Ionicons name="trash-outline" size={22} color={Colors.colors.error[100]} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 16,
    padding: 12,
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: Colors.colors.gray[200],
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    ...globalStyles.mediumBodyBold,
    color: Colors.colors.gray[500],
  },
  description: {
    ...globalStyles.smallBodyRegular,
    color: Colors.colors.gray[400],
    marginTop: 4,
  },
  infoRow: {
      flexDirection: 'row',
      marginTop: 8,
      gap: 16,
  },
  infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  infoText: {
      ...globalStyles.smallBodySemiBold,
      color: Colors.colors.gray[500],
      marginLeft: 4,
  },
  actions: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  actionButton: {
    padding: 4,
  },
});

export default MyRecipeCard;