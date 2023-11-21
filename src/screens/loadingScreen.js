import React, { useEffect } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import { Colors } from "../constants/styles";

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        zh_tw: require("../../assets/fonts/jf-openhuninn-2.0.ttf"),
      });
      navigation.navigate("Signin");
    }
    loadFont();
  });

  return <View style={{ flex: 1, backgroundColor: Colors.whiteColor }} />;
};

export default LoadingScreen;
