
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';
import User from '@/models/user';


interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : (user.username?.[0] || '?').toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.name}>{user.name || user.username}</Text>
      <Text style={styles.username}>@{user.username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 56,
    backgroundColor: Colors.colors.primary[600],
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.colors.primary[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.colors.neutral[100]
  },
  avatarText: {
    ...globalStyles.headlineMedium,
    color: Colors.colors.neutral[100],
  },
  name: {
    ...globalStyles.headlineSmall,
    color: Colors.colors.gray[900],
  },
  username: {
    ...globalStyles.largeBody,
    color: Colors.colors.gray[900],
    marginTop: 4,
  },
});

export default ProfileHeader;