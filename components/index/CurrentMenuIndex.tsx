// React and Expo imports
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

// Components imports
import PaddingView from "@/components/views/PaddingView";
import TitleParagraph from "@/components/text/TitleParagraph";
import DayCard from "@/components/menu/DayCard";

// Hooks imports
import { useMenu } from "@/hooks/useMenu";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

// Styles imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";

// Models imports
import { RecipeShort } from "@/models/mealPlan";



interface DayInfo {
  dayIndex: number;
  date: Date;
}

const getWeekDays = (): DayInfo[] => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);

  const week: DayInfo[] = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    
    week.push({dayIndex: i, date: day,});
  }

  return week;
};

const CurrentMenuIndex = () => {
  const { menu } = useMenu();
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const todayDate = new Date();
  const weekDays = getWeekDays();


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PaddingView>
          <TitleParagraph
            title={t('index.noMenu.welcome', { name: user?.name})}
            paragraph={t('index.menu.subtitle')}
            titleStyle={{ fontSize: 28, lineHeight: 34}}
            containerStyle={{ marginTop: 16, marginBottom: 24 }}
          />

          <View style={styles.dayListContainer}>
            {weekDays.map(({ dayIndex, date }) => {
              const isToday = date.getDate() === todayDate.getDate() &&
                            date.getMonth() === todayDate.getMonth();
                            
              const dayName = t(`constants.days.${dayIndex}`);
              const dayNumber = date.getDate();

              const dayData = menu!.days.find(d => d.day === dayIndex);
              const recipesForDay = dayData?.meals
                .map(slotMeal => slotMeal.recipe)
                .filter((recipe): recipe is RecipeShort => recipe !== null) || [];
              
              return (
                <DayCard
                  key={dayIndex}
                  dayName={dayName}
                  dayNumber={dayNumber}
                  isToday={isToday}
                  recipes={recipesForDay}
                  onPress={() => router.push(`/(home)/(tabs)/menu/${dayIndex}`)}
                />
              );
            })}
              
          </View>
        </PaddingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.gray[100],
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120, 
  },
  pageTitle: {
    textAlign: "left",
    marginBottom: 24,
    marginTop: 16,
    paddingHorizontal: 0,
  },
  dayListContainer: {
    paddingHorizontal: 0,
    gap: 12,
  },
  dayCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.colors.neutral[100],
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: Colors.colors.neutral[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  todayCard: {
    borderColor: Colors.colors.primary[200],
    borderWidth: 1.5,
    backgroundColor: Colors.colors.primary[600]
  },
  dayCardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dayIcon: {
    marginRight: 16,
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
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default CurrentMenuIndex;