import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import searchScreen from "../screens/other/searchScreen";
import bottomTabBarScreen from "../screens/bottomTabBarScreen";
import LoadingScreen from "../screens/loadingScreen";
import GameRecordingScreen from "../screens/category/GameRecordingScreen.js";
import TimerScreen from "../screens/category/TimerScreen.js";

import GameScreen from "../screens/category/GameScreen";
import MyGamesScreen from "../screens/category/MyGamesScreen";
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
        <Stack.Screen name="GameRecording" component={GameRecordingScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Timer" component={TimerScreen} />
        <Stack.Screen name="MyGames" component={MyGamesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
