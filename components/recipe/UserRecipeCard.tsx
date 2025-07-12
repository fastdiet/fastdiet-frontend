import { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { RecipeShort } from '@/models/mealPlan'; // O tu modelo de receta de usuario

interface UserRecipeCardProps {
  recipe: RecipeShort; // Reemplaza con tu modelo si es diferente
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const UserRecipeCard = ({ recipe, onPress, onEdit, onDelete }: UserRecipeCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { transform: [{ scale: pressed ? 0.99 : 1 }], opacity: pressed ? 0.95 : 1, }
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {imageLoading && (
          <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={Colors.colors.primary[200]} />
        )}
        <Image
          source={recipe.image_url ? { uri: recipe.image_url } : require('@/assets/images/loginFastdiet.png')}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
            locations={[0, 0.6, 1]}
            style={styles.gradient}
          />

          {/* Botones de acción para Editar y Eliminar */}
          <View style={styles.topOverlay}>
            <View style={styles.actionButtonsGroup}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => { e.stopPropagation(); onEdit(); }}
                hitSlop={10}
              >
                  <MaterialCommunityIcons name="pencil-outline" size={22} color={Colors.colors.neutral[100]} />
              </TouchableOpacity>
              
              <View style={styles.separator} />
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => { e.stopPropagation(); onDelete(); }}
                hitSlop={10}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={22} color={Colors.colors.neutral[100]}/>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info de tiempo y calorías */}
          <View style={styles.bottomOverlay}>
            {recipe.ready_min != null && (
              <View style={styles.infoPill}>
                <MaterialCommunityIcons name="timer-outline" size={16} color={Colors.colors.neutral[100]} />
                <Text style={styles.infoText}> {recipe.ready_min} min</Text>
              </View>
            )}
            {recipe.calories != null && (
              <View style={styles.infoPill}>
                <MaterialCommunityIcons name="fire" size={16} color={Colors.colors.neutral[100]} />
                <Text style={styles.infoText}> {Math.round(recipe.calories)} kcal</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={28}
          color={Colors.colors.primary[200]}
        />
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
    height: 220,
    backgroundColor: Colors.colors.gray[200],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonsGroup: {
    flexDirection: 'row', // Cambiado a 'row'
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingVertical: 4,
  },
  actionButton: {
    padding: 8,
  },
  separator: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  infoText: {
    marginLeft: 4,
    ...globalStyles.smallBodySemiBold,
    color: Colors.colors.neutral[100],
  },
  titleContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 12,
    backgroundColor: Colors.colors.neutral[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTitle: {
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.gray[500],
    lineHeight: 24,
  },
});

export default UserRecipeCard;