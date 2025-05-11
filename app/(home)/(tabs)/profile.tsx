// React & React Native Imports
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

// Component Imports
import { LoadingScreen } from "@/components/LoadingScreen";

// Hook Imports
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    logout();
    router.replace("/login");
  };

  return user ? (
    <View>
      <Text>Hola</Text>
      <Button title="Cerrar sesión de Google" onPress={handleLogout} />
    </View>
  ) : (
    <LoadingScreen />
  );
}
