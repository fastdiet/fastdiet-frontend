// React & React Native Imports
import { StyleSheet, View, Text } from "react-native";

// Component Imports
import { LoadingScreen } from "@/components/LoadingScreen";

// Hook Imports
import { useAuth } from "@/hooks/useAuth";
import { useMenu } from "@/hooks/useMenu";
import NoCurrentMenuIndex from "@/components/index/NoCurrentMenuIndex";

export default function IndexScreen() {
  const { user } = useAuth();
  const {menu} = useMenu();

  if(menu){
    return (
      <View>
        <Text>Hola hola</Text>
      </View>
    );
  }else{
    return (
      <NoCurrentMenuIndex />
    );
  }
  
}

const styles = StyleSheet.create({});
