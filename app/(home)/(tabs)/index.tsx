// React & React Native Imports
import { StyleSheet, View, Text } from "react-native";

// Component Imports
import { LoadingScreen } from "@/components/LoadingScreen";

// Hook Imports
import { useAuth } from "@/hooks/useAuth";

export default function IndexScreen() {
  const { user } = useAuth();
  return user ? (
    <View>
      <Text>Hola hola</Text>
    </View>
  ) : (
    <LoadingScreen />
  );
}

const styles = StyleSheet.create({});
