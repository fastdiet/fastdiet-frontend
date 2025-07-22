import { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Pressable, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';


import { useMyRecipes } from '@/hooks/useMyRecipes';
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";
import { RecipeShort } from '@/models/mealPlan';
import { ChevronRight, Clock, Pencil, Trash2, Users } from 'lucide-react-native';

interface RecipeCardProps {
  recipe: RecipeShort;
  onPress: () => void;
  onEdit: () => void;
}

const MyRecipeCard = ({ recipe, onPress, onEdit }: RecipeCardProps) => {
  const { t } = useTranslation();
  const [imageLoading, setImageLoading] = useState(true);
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
            const { success, error } = await deleteRecipe(recipe.id, false);

            if (success) {
                Toast.show({ type: 'success', text1: t('myRecipes.delete.success') });
            } else if (error?.code === "RECIPE_LINKED_TO_MEAL_PLAN") {
                Alert.alert(
                t('myRecipes.delete.forceTitle'),
                t('myRecipes.delete.forceMessage', { title: recipe.title }),
                [
                    { text: t('cancel'), style: 'cancel' },
                    {
                      text: t('deleteAnyway'),
                      style: 'destructive',
                      onPress: async () => {
                        const { success: forceSuccess, error: forceError } = await deleteRecipe(recipe.id, true);
                        if (forceSuccess) {
                          Toast.show({ type: 'success', text1: t('myRecipes.delete.success') });
                        } else {
                          Toast.show({ type: 'error', text1: t('error'), text2: forceError?.message });
                        }
                      },
                    },
                ]
                );
            } else {
                Toast.show({ type: 'error', text1: t('error'), text2: error?.message });
            }
            },
        },
        ]
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [ styles.card, { transform: [{ scale: pressed ? 0.98 : 1 }] , opacity: pressed ? 0.9 : 1,} ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {imageLoading && (
          <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={Colors.colors.primary[200]} />
        )}
        <Image
          source={recipe.image_url ? { uri: recipe.image_url } : require('@/assets/images/recipe-placeholder.jpg')}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.0)', 'transparent', 'rgba(0,0,0,0.0)']}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        />
        
            <View style={styles.topOverlay}>
                
                <View style={styles.actionButtonsGroup}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => { e.stopPropagation(); onEdit(); }}
                        hitSlop={10}
                    >
                      <Pencil size={22} color={Colors.colors.neutral[100]} />
                    </TouchableOpacity>
                    
                    <View style={styles.separator} />
                    
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => { e.stopPropagation(); handleDelete(); }}
                        hitSlop={10}
                    >
                      <Trash2 size={22} color={Colors.colors.neutral[100]} />
                    </TouchableOpacity>
                </View>
            </View>

        <View style={styles.bottomInfoOverlay}>
          {recipe.ready_min && (
            <View style={styles.infoPill}>
              <Clock size={14} color={Colors.colors.neutral[100]} />
              <Text style={styles.infoText}>{recipe.ready_min} min</Text>
            </View>
          )}
          {recipe.servings && (
            <View style={styles.infoPill}>
              <Users size={14} color={Colors.colors.neutral[100]} />
              <Text style={styles.infoText}>{recipe.servings}</Text>
            </View>
          )}
        </View>
      </View>
    
      <View style={styles.titleContainer}>
            <View style={styles.titleTextWrapper}>
            <Text style={styles.recipeTitle} numberOfLines={2} ellipsizeMode="tail">{recipe.title}</Text>
            </View>
            <ChevronRight size={26} color={Colors.colors.primary[200]} />
        </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: Colors.colors.neutral[100],
    overflow: 'hidden',
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.colors.gray[200],
  },
  image: { width: '100%', height: '100%' },
  gradient: { ...StyleSheet.absoluteFillObject },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  bottomInfoOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonsGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    padding: 8,
  },
   actionButton: {
    padding: 6,
  },
  separator: {
    height: 1,
    width: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 4,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 20,
  },
  infoText: {
    ...globalStyles.smallBodySemiBold,
    color: Colors.colors.neutral[100],
    marginLeft: 4,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.colors.neutral[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleTextWrapper: {
    flex: 1,
    marginRight: 8,
  },
  recipeTitle: {
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.gray[500],
    lineHeight: 24,
  },
});

export default MyRecipeCard;