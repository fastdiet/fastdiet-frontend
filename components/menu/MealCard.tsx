// React and Expo imports
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';

// Model imports
import { RecipeShort } from "@/models/mealPlan";

// Style imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";


const getMealIcon = (mealKey: "breakfast" | "lunch" | "dinner") => {
  switch (mealKey) {
    case "breakfast": return "coffee-outline";
    case "lunch": return "food-croissant";
    case "dinner": return "silverware-variant";
    default: return "food-apple-outline";
  }
};

interface MealCardProps {
  mealTypeKey: "breakfast" | "lunch" | "dinner";
  mealTypeDisplay: string;
  recipe: RecipeShort;
  onPress?: () => void;
  onDelete: () => void;
  onChange: () => void;
}

const MealCard = ({ mealTypeKey, mealTypeDisplay, recipe, onPress, onDelete, onChange }: MealCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { transform: [{ scale: pressed ? 0.98 : 1 }], opacity: pressed ? 0.9 : 1, }
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {imageLoading && (
          <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={Colors.colors.primary[200]} />
        )}
        <Image
          source={{ uri: recipe.image_url ?? "" }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
            locations={[0, 0.5, 1]}
            style={styles.gradient}
          />

          {/* Top section for the meal type pill and action buttons */}
          <View style={styles.topOverlay}>
            <View style={styles.mealTypePill}>
              <MaterialCommunityIcons
                name={getMealIcon(mealTypeKey)}
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
                  <MaterialCommunityIcons name="swap-horizontal" size={22} color={Colors.colors.neutral[100]} />
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

          {/* Bottom section for calories info */}
          {recipe.calories != null && (
            <View style={styles.bottomOverlay}>
              <MaterialCommunityIcons name="fire" size={16} color={Colors.colors.neutral[100]} />
              <Text style={styles.caloriesText}> {Math.round(recipe.calories)} kcal</Text>
            </View>
          )}
        </View>
      </View>

      {/* Title section below the image, includes navigation indicator */}
      <View style={styles.titleContainer}>
        <View style={styles.titleTextWrapper}>
          <Text style={styles.recipeTitle} numberOfLines={2} ellipsizeMode="tail">{recipe.title}</Text>
        </View>
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
  caloriesText: {
    marginLeft: 6,
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

export default MealCard;