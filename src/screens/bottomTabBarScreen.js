import React, { useState, useCallback } from "react";
import { Colors, Fonts, Sizes } from "../constants/styles";
import {
  Dimensions,
  BackHandler,
  Text,
  View,
  StyleSheet,
  Image,
} from "react-native";
import HomeScreen from "./tab/homeScreen";
import CategoryScreen from "./tab/categoryScreen";
import ProfileScreen from "./tab/profileScreen";
import { useFocusEffect } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {
  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setBackClickCount] = useState(0);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: Colors.whiteColor,
            height: SCREEN_HEIGHT * 0.09,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              tabBarItem({
                icon: require("../../assets/images/icons/home.png"),
                focused,
              }),
          }}
        />
        <Tab.Screen
          name="Category"
          component={CategoryScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              tabBarItem({
                icon: require("../../assets/images/icons/category.png"),
                focused,
              }),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              tabBarItem({
                icon: require("../../assets/images/icons/user.png"),
                focused,
              }),
          }}
        />
      </Tab.Navigator>
      {exitInfo()}
    </>
  );

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={[styles.animatedView]}>
        <Text style={{ ...Fonts.whiteColor13Medium }}>
          Press Back Once Again to Exit
        </Text>
      </View>
    ) : null;
  }

  function tabBarItem({ icon, focused }) {
    return (
      <Image
        source={icon}
        style={{
          width: SCREEN_HEIGHT * 0.03,
          height: SCREEN_HEIGHT * 0.03,
          resizeMode: "contain",
          tintColor: focused ? Colors.blackColor : Colors.grayColor,
        }}
      />
    );
  }
};

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TabNavigator;
