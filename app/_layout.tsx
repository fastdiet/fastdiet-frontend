// React & React Native Imports
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

// Component Imports
import { LoadingScreen } from "@/components/LoadingScreen";

// Hook Imports
import { useFonts } from "expo-font";

// Utility Imports
import Toast from "react-native-toast-message";

// Navigation Imports
import { Slot, } from "expo-router";

// Context Imports
import { AuthProvider } from "@/context/AuthContext";

// Splash Screen Imports
import * as SplashScreen from "expo-splash-screen";

// Reanimated Imports
import "react-native-reanimated";
import {initI18n} from "@/i18n";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Avoid that the loading screen dissappears before
SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  webClientId: '1029285084877-2b68aomhptg9jr5b6hi1k07q1k5dr1hg.apps.googleusercontent.com',
  iosClientId: '1029285084877-up0oqd75c8jofll6he0vs10959v2r4ub.apps.googleusercontent.com'
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    InterRegular: require("@/assets/fonts/Inter_18pt-Regular.ttf"),
    InterSemiBold: require("@/assets/fonts/Inter_18pt-SemiBold.ttf"),
    InterBold: require("@/assets/fonts/Inter_18pt-Bold.ttf"),
    InterMedium: require("@/assets/fonts/Inter_18pt-Medium.ttf"),
  });


  const [i18nReady, setI18nReady] = useState(false);
  
  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, i18nReady]);

  if (!loaded || !i18nReady) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthProvider>
          <Slot />
          <Toast />
          <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaView>
  );
}

