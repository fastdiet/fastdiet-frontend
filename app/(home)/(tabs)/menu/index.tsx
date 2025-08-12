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
import { useMyRecipes } from "@/hooks/useMyRecipes";
import FullScreenLoading from "@/components/FullScreenLoading";


export default function IndexScreen() {
  const { menu, loading: loadingMenu } = useMenu();
  const { loading: loadingRecipes } = useMyRecipes();
  const { t } = useTranslation();


  if (loadingMenu || loadingRecipes) {
    return <FullScreenLoading visible={true} />
  }

  if(menu){
    return (<CurrentMenuIndex />)
  }else{
    return <NoCurrentMenuIndex />;
  }
  
}

