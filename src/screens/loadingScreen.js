import React, { useEffect } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import { Colors } from "../constants/styles";
import * as SecureStore from "expo-secure-store";

const checkLoginState = async (navigation) => {
  try {
    const userToken = await SecureStore.getItemAsync("userToken");
    if (userToken) {
      navigation.push("BottomTabBar");
    } else {
      navigation.navigate("Signin");
    }
  } catch (e) {
    console.error("Login error:", e);
  }
};

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        zh_tw: require("../../assets/fonts/jf-openhuninn-2.0.ttf"),
      });
      checkLoginState(navigation);
    }
    loadFont();
  });

  return <View style={{ flex: 1, backgroundColor: Colors.whiteColor }} />;
};

export default LoadingScreen;
