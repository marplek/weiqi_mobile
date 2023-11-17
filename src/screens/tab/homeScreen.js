import React, { useState } from "react";
import { SafeAreaView, Dimensions, View, StatusBar } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
      <View style={{ flex: 1 }}></View>
    </SafeAreaView>
  );
};

export default HomeScreen;
