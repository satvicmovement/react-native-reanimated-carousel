import { useEffect, useState } from "react";
import { ColorValue, I18nManager, Platform, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Updates from "expo-updates";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import Stack from "expo-router/stack";
import { useWebContext } from "@/store/WebProvider";
import { isWeb } from "@/utils";
import { QRCode } from "@/components/QRCode";
import {
  CustomAnimationsDemos,
  ExperimentDemos,
  LayoutsDemos,
} from "./demos/routes";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "/",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

const Restart = () => {
  if (Platform.OS === "web") window.location.reload();
  else Updates.reloadAsync();
};

function RootLayoutNav() {
  const headerShown = !useWebContext()?.page;
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown,
              contentStyle: {
                flex: 1,
              },
              headerRight: ({ tintColor }: { tintColor?: ColorValue }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {isWeb && (
                    <>
                      <QRCode tintColor={tintColor} />
                      <Text style={{ color: tintColor }}> | </Text>
                    </>
                  )}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      I18nManager.forceRTL(!isRTL);
                      setIsRTL(!isRTL);
                      Restart();
                    }}
                  >
                    <Text style={{ color: tintColor, marginRight: 12 }}>
                      {isRTL ? "LTR" : "RTL"}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              ),
            }}
          >
            <Stack.Screen name="home" />
            {[
              ...LayoutsDemos,
              ...CustomAnimationsDemos,
              ...ExperimentDemos,
            ].map((item) => (
              <Stack.Screen
                key={item.name}
                name={`demos/${item.name}/index`}
                options={{
                  title: item.title,
                }}
              />
            ))}
          </Stack>
        </ThemeProvider>
      </GestureHandlerRootView>
    </View>
  );
}
