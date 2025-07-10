import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import globalStyles from '@/styles/global';

interface ProfileListItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

const ProfileListItem = ({ icon, label, value, onPress, isDestructive = false }: ProfileListItemProps) => {
  const isActionable = !!onPress;
  const isSingleLine = !value;

  const primaryTextColor = isDestructive ? Colors.colors.error[100] : Colors.colors.gray[700];
  const iconColor = isDestructive ? Colors.colors.error[100] : Colors.colors.gray[400];

  return (
    <TouchableOpacity 
      style={[styles.container, isSingleLine && styles.singleLineContainer]} 
      onPress={onPress} 
      disabled={!isActionable}
    >
      <Ionicons name={icon} size={24} color={iconColor} style={styles.icon} />
      
      <View style={styles.textContainer}>
        {isSingleLine ? (
          <Text style={[styles.singleLineLabel, { color: primaryTextColor }]}>
            {label}
          </Text>
        ) : (
          <>
            <Text style={styles.label}>
              {label}
            </Text>
            <Text style={[styles.value, { color: primaryTextColor }]} numberOfLines={1} ellipsizeMode="tail">
              {value}
            </Text>
          </>
        )}
      </View>
      
      {isActionable && !isDestructive && (
        <Ionicons name="chevron-forward-outline" size={20} color={Colors.colors.gray[300]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.colors.neutral[100],
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colors.gray[100],
  },
  singleLineContainer: {
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    ...globalStyles.smallBodyRegular,
    color: Colors.colors.gray[500],
    marginBottom: 2,
  },
  value: {
    ...globalStyles.largeBody,
  },
  singleLineLabel: {
    ...globalStyles.largeBody,
  },
});

export default ProfileListItem;