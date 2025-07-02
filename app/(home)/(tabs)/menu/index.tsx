// React & React Native Imports
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";


// Hook Imports
import { useMenu } from "@/hooks/useMenu";
import { useTranslation } from "react-i18next";

// Components Imports
import NoCurrentMenuIndex from "@/components/index/NoCurrentMenuIndex";
import CurrentMenuIndex from "@/components/index/CurrentMenuIndex";

// Style imports
import { Colors } from "@/constants/Colors";
import globalStyles from "@/styles/global";


export default function IndexScreen() {
  const {menu, loading} = useMenu();
  const { t } = useTranslation();


  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.colors.primary[100]} />
        <Text style={[globalStyles.mediumBodySemiBold, styles.messageText]}>{t("index.menu.loading")}</Text>
      </View>
    );
  }

  if(menu){
    return (<CurrentMenuIndex />)
  }else{
    if (!loading) {
        return <NoCurrentMenuIndex />;
    } else {
        return (
            <View style={styles.centeredContainer}>
              <ActivityIndicator size="large" color={Colors.colors.primary[100]} />
              <Text style={[globalStyles.mediumBodySemiBold, styles.messageText]}>{t("index.menu.loading")}</Text>
            </View>
          );
    }
  }
  
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.colors.gray[100],
  },
  messageText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
});
