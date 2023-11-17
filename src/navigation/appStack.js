import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import bottomTabBarScreen from "../screens/bottomTabBarScreen";
import LoadingScreen from "../screens/loadingScreen";

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
          name="BottomTabBar"
          component={bottomTabBarScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
