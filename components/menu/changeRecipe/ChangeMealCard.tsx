// React and Expo imports
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';

// Model imports
import { RecipeShort } from "@/models/mealPlan";

// Style imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";
import { Coffee, Sun, Moon, Apple, Flame } from "lucide-react-native";
import { getMealIcon } from "@/components/menu/MealCard";




interface ChangeMealCardProps {
  mealType: string;
  mealTypeDisplay: string;
  recipe: RecipeShort;
}

const ChangeMealCard = ({ mealType, mealTypeDisplay, recipe }: ChangeMealCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const Icon = getMealIcon(mealType);

  return (
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
          </View>

          {/* Bottom section for calories info */}
          {recipe.calories != null && (
            <View style={styles.bottomOverlay}>
              <Flame size={15}  fill={Colors.colors.neutral[100]} color={Colors.colors.neutral[100]} style={{ marginRight: 0 }} />
              <Text style={styles.caloriesText}> {Math.round(recipe.calories)} kcal</Text>
            </View>
          )}
        </View>
      </View>

      {/* Title section below the image */}
      <View style={styles.titleContainer}>
        <View style={styles.titleTextWrapper}>
          <Text style={styles.recipeTitle} numberOfLines={2} ellipsizeMode="tail">{recipe.title}</Text>
        </View>
      </View>
    </View>
    </View>
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
  bottomOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  caloriesText: {
    marginLeft: 2,
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
});

export default ChangeMealCard;