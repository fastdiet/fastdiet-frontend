// React and Expo imports
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Pressable } from "react-native";
import { useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';

// Model imports
import { RecipeShort } from "@/models/mealPlan";

// Style imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";
import { Coffee, Sun, Moon, Apple, Trash2, ChevronRight, Flame, ArrowRightLeft, Clock, Users, Cookie, Leaf, GlassWater, Soup  } from "lucide-react-native";


export const getMealIcon = (mealKey: string) => {
  switch (mealKey) {
    case "breakfast": return Coffee;
    case "lunch": return Sun;
    case "dinner": return Moon;
    case "snack": return Apple;
    case "dessert": return Cookie;
    case "salad": return Leaf;
    case "beverage": return GlassWater;
    case "appetizer": return Soup;
    default: return Apple;
  }
};

interface MealCardProps {
  mealType: string;
  mealTypeDisplay: string;
  recipe: RecipeShort;
  onPress?: () => void;
  onDelete: () => void;
  onChange: () => void;
}

const MealCard = ({ mealType, mealTypeDisplay, recipe, onPress, onDelete, onChange }: MealCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const Icon = getMealIcon(mealType);

  return (
    <Pressable
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.9 : 1, }
      ]}
      onPress={onPress}
    >
      <View style={styles.shadowContainer}>
      <View style={styles.card}>
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
        
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.6)',
              'rgba(0,0,0,0.3)',
              'transparent',
              'rgba(0,0,0,0.3)',
              'rgba(0,0,0,0.6)'
            ]}
            locations={[0, 0.2, 0.5, 0.8, 1]} 
            style={styles.gradient}
          />

          {/* Top section for the meal type pill and action buttons */}
          <View style={styles.topOverlay}>
            <View style={styles.mealTypePill}>
              <Icon
                size={16}
                color={Colors.colors.neutral[100]}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.mealTypeText}>{mealTypeDisplay}</Text>
            </View>

            <View style={styles.actionButtonsGroup}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => { e.stopPropagation(); onChange(); }}
                hitSlop={10}
              >
                <ArrowRightLeft size={22} color={Colors.colors.neutral[100]} />
              </TouchableOpacity>
              
              <View style={styles.separator} />
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => { e.stopPropagation(); onDelete(); }}
                hitSlop={10}
              >
                <Trash2 size={22} color={Colors.colors.neutral[100]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom section for calories info */}
          
            <View style={styles.bottomInfoOverlay}>
              {recipe.calories != null ? (
                <View style={styles.caloriesContainer}>
                  <Flame size={14} fill={Colors.colors.neutral[100]} color={Colors.colors.neutral[100]} />
                  <Text style={styles.caloriesText}>{Math.round(recipe.calories)} kcal</Text>
                </View>
              )
              : (
                <>
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
                </>
              )
            }
            </View>
          
        </View>
      </View>

      {/* Title section below the image, includes navigation indicator */}
      <View style={styles.titleContainer}>
        <View style={styles.titleTextWrapper}>
          <Text style={styles.recipeTitle} numberOfLines={2} ellipsizeMode="tail">{recipe.title}</Text>
        </View>
        <ChevronRight size={26} color={Colors.colors.primary[200]} />
      </View>
      </View>
    </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: Colors.colors.neutral[100],
    overflow: 'hidden',
  },
  shadowContainer: {
    borderRadius: 16,
    backgroundColor: Colors.colors.gray[100],
    shadowColor: Colors.colors.gray[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
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
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bottomInfoOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  mealTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 12,
  },
  mealTypeText: {
    ...globalStyles.smallBodySemiBold,
    color: Colors.colors.neutral[100],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  caloriesContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesText: {
    marginLeft: 4,
    ...globalStyles.smallBodySemiBold,
    color: Colors.colors.neutral[100],
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
  titleTextWrapper: {
    flex: 1,
    marginRight: 8,
  },
  recipeTitle: {
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.gray[500],
    lineHeight: 24,
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
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default MealCard;