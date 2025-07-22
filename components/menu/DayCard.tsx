// React and Expo imports
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";

// Models imports
import { RecipeShort } from "@/models/mealPlan";

// Style Imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";
import { ChevronRight } from 'lucide-react-native';



interface DayCardProps {
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  recipes: RecipeShort[];
  onPress: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ dayName, dayNumber, isToday, recipes, onPress }) => {
  const { t } = useTranslation();
  const isHighlighted = isToday && recipes.length > 0;

  return (
    <TouchableOpacity
      style={[styles.dayCard, isHighlighted && styles.todayCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Left: Number Month - Weekday */}
      <View style={styles.dayInfoContainer}>
        <View style={[styles.dayNumberContainer, isHighlighted && styles.todayNumberContainer]}>
            <Text style={[styles.dayNumberText, isHighlighted && styles.todayNumberText]}>
                {dayNumber} 
            </Text>
        </View>
        <View>
          <Text style={[styles.dayText, isHighlighted && styles.todayText]}>{dayName}</Text>
          {isToday && (
            <View style={{ alignSelf: 'flex-start' }}>
                <Text style={styles.todayLabel}>{t("constants.days.today")}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Right: Menu images */}
      <View style={styles.menuPreviewContainer}>
        {recipes.length > 0 ? (
          <View style={styles.mealImagesContainer}>
            {recipes.slice(0, 3).map((recipe, index) => (
              <Image
                key={recipe.id}
                source={recipe.image_url ? { uri: recipe.image_url } : require('@/assets/images/recipe-placeholder.jpg')}
                style={[styles.mealImage, { zIndex: 3 - index, marginLeft: index > 0 ? -15 : 0 }]}
              />
            ))}
          </View>
        ) : (
           <Text style={styles.noMealsText} numberOfLines={1} ellipsizeMode="tail">
            {t("index.menu.noMealsForDay")}
          </Text>
        )}
      </View>
      <ChevronRight size={26} color={isHighlighted ? Colors.colors.primary[100] : Colors.colors.gray[300]} />
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 80,
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  todayCard: {
    borderColor: Colors.colors.primary[200],
    borderWidth: 1.5,
    backgroundColor: Colors.colors.primary[600],
  },
  dayInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayText: {
    ...globalStyles.largeBodySemiBold,
    color: Colors.colors.gray[500],
  },
  todayText: {
    color: Colors.colors.primary[100],
    fontFamily: "InterBold",
  },
  todayLabel: {
    ...globalStyles.smallBodySemiBold,
    backgroundColor: Colors.colors.primary[200],
    color: Colors.colors.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  menuPreviewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  mealImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.colors.neutral[100],
  },
  noMealsText: {
    ...globalStyles.mediumBodyRegular,
    color: Colors.colors.gray[400],
    fontStyle: 'italic',
    marginLeft: 25
  },
  noMealsTextToday: {
    color: Colors.colors.primary[200],
    fontStyle: 'normal',
    fontWeight: '500',
  },
   dayNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.colors.gray[100],
  },
  todayNumberContainer: {
    backgroundColor: Colors.colors.primary[100],
  },
  dayNumberText: {
    ...globalStyles.mediumBodyBold,
    color: Colors.colors.gray[400],
  },
  todayNumberText: {
    color: Colors.colors.neutral[100],
  },
});

export default DayCard;