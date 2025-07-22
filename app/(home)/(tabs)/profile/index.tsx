import { View, ScrollView, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

// Component Imports
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsCard from '@/components/profile/StatsCard';
import ProfileListItem from '@/components/profile/ProfileListItem';

// Style Imports
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import { AlertTriangle, Dumbbell, Goal, KeyRound, Leaf, LogOut, Mail, Trash2, UserCircle, UtensilsCrossed } from 'lucide-react-native';




const SectionTitle = ({ title }: { title: string }) => <Text style={styles.sectionTitle}>{title}</Text>;

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout, deleteAccount, user, userPreferences } = useAuth();

  if (!user || !userPreferences) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.colors.gray[100] }}>
        <ActivityIndicator size="large" color={Colors.colors.primary[200]} />
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert( t('profile.logout'), t('profile.logout_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('accept'), style: 'destructive', 
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert( t('profile.confirmDeleteTitle'), t('profile.confirmDeleteMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('profile.confirmDeleteButton'), style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            router.replace('/login');
          }
        },
      ],
    );
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ProfileHeader user={user} />
      
      <View style={styles.content}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatsCard label={t('profile.dailyCalories')} value={`${userPreferences.calories_goal || 0}`} />
          <StatsCard label={t('profile.weight')} value={`${user.weight || '-'} kg`} />
          <StatsCard label={t('profile.height')} value={`${user.height || '-'} cm`} />
        </View>
        
        {/* My plan Section */}
        <SectionTitle title={t('profile.myPlan')} />
        <View style={styles.listContainer}>
          <ProfileListItem 
            iconComponent={Leaf}
            label={t('profile.dietType')}
            value={userPreferences.diet?.name ? t(`constants.diets.${userPreferences.diet.name}`) : t('profile.notSpecifiedA')}
            onPress={() => router.push({
              pathname: '/profile/editDiet',
              params: { currentDietId: userPreferences.diet?.id }
            })}
          />
          <ProfileListItem 
            iconComponent={Goal}
            label={t('profile.goal')}
            value={userPreferences.goal ? t(`goal.${userPreferences.goal}.title`) : t('profile.notSpecifiedO')}
            onPress={() => router.push({
              pathname: '/profile/editGoal',
              params: { currentGoal: userPreferences.goal }
            })}
          />
          <ProfileListItem 
            iconComponent={Dumbbell}
            label={t('profile.activityLevel')}
            value={userPreferences.activity_level ? t(`activity.${userPreferences.activity_level}.title`) : t('profile.notSpecifiedO')}
            onPress={() => router.push({
              pathname: '/profile/editActivity',
              params: { currentActivity: userPreferences.activity_level }
            })}
          />
          <ProfileListItem 
            iconComponent={UtensilsCrossed}
            label={t('profile.cuisines')}
            value={t('profile.cuisinesCount', { count: userPreferences.cuisines?.length || 0 })}
            onPress={() => {
              const currentIds = userPreferences.cuisines?.map(c => c.id) || [];
              router.push({
                pathname: '/profile/editCuisines',
                params: { currentCuisineIds: currentIds.join(',') }
              });
            }}
          />
           <ProfileListItem 
            iconComponent={AlertTriangle}
            label={t('profile.intolerances')}
            value={t('profile.intolerancesCount', { count: userPreferences.intolerances?.length || 0 })}
            onPress={() => {
              const currentIds = userPreferences.intolerances?.map(i => i.id) || [];
              router.push({
                pathname: '/profile/editIntolerances',
                params: { currentIntoleranceIds: currentIds.join(',') }
              });
            }}
          />
        </View>

        {/* Personal Section */}
        <SectionTitle title={t('profile.myProfile')} />
        <View style={styles.listContainer}>
          <ProfileListItem 
            iconComponent={Mail}
            label={t('profile.email')}
            value={user.email}
          />
          <ProfileListItem 
            iconComponent={UserCircle}
            label={t('profile.personalData')}
            onPress={() => router.push('/profile/editPersonalData')}
          />
          {user.auth_method !== 'google' && (
            <ProfileListItem 
              iconComponent={KeyRound}
              label={t('profile.changePassword')}
              onPress={() => router.push('/profile/changePassword')}
            />
          )}
        </View>

          

        {/* Account Section */}
        <SectionTitle title={t('profile.account')} />
        <View style={styles.listContainer}>
          <ProfileListItem 
            iconComponent={LogOut}
            label={t('profile.logout')}
            onPress={handleLogout}
          />
          <ProfileListItem 
            iconComponent={Trash2}
            label={t('profile.deleteAccount')}
            onPress={handleDelete}
            isDestructive={true}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colors.gray[100],
  },
  contentContainer: {
    paddingBottom: 100, 
  },
  content: {
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: -32,
    marginBottom: 24,
  },
  sectionTitle: {
    ...globalStyles.titleSmall,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  listContainer: {
    backgroundColor: Colors.colors.neutral[100],
    borderRadius: 16,
    overflow: 'hidden',
  },
});