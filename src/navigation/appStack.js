import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import searchScreen from "../screens/other/searchScreen";
import bottomTabBarScreen from "../screens/bottomTabBarScreen";
import LoadingScreen from "../screens/loadingScreen";
import WeiqiBoardScreen from "../screens/category/weiqiBoardScreen";
import GamesScreen from "../screens/category/GamesScreen";
import signinScreen from "../screens/auth/signinScreen";
import signupScreen from "../screens/auth/signupScreen";
import verificationScreen from "../screens/auth/verificationScreen";
const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen
          name="Signin"
          component={signinScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen name="Signup" component={signupScreen} />
        <Stack.Screen name="Verification" component={verificationScreen} />
        <Stack.Screen
          name="BottomTabBar"
          component={bottomTabBarScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen name="Search" component={searchScreen} />
        <Stack.Screen name="WeiqiBoard" component={WeiqiBoardScreen} />
        <Stack.Screen name="Games" component={GamesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
