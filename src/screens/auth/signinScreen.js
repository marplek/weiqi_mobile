import React, { useState, useCallback } from "react";
import {
  BackHandler,
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const SigninScreen = ({ navigation }) => {
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
    updateState({ backClickCount: 1 });
    setTimeout(() => {
      updateState({ backClickCount: 0 });
    }, 1000);
  }

  const [state, setState] = useState({
    emailOrMobileNo: null,
    password: null,
    securePassword: false,
    backClickCount: 0,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { emailOrMobileNo, password, securePassword, backClickCount } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("../../../assets/images/bg.png")}
          style={{ flex: 1 }}
        >
          {signinTitle()}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <ScrollView
              contentContainerStyle={{
                justifyContent: "center",
                flexGrow: 1,
                paddingHorizontal: Sizes.fixPadding * 2.0,
              }}
              showsVerticalScrollIndicator={false}
            >
              {emailOrMobileNoTextField()}
              {passwordTextField()}
              {forgetPasswordText()}
              {dontHaveAccountInfo()}
              {signinButton()}
              {orIndicator()}
              {loginWithGoogleButton()}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
      {backClickCount == 1 ? (
        <View style={[styles.animatedView]}>
          <Text style={{ ...Fonts.whiteColor13Medium }}>
            Press Back Once Again to Exit
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );

  function signinButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.push("Signup")}
        style={styles.signinButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor20Bold }}>Sign In</Text>
      </TouchableOpacity>
    );
  }

  function orIndicator() {
    return (
      <View style={styles.orIndicatorWrapStyle}>
        <View
          style={{
            backgroundColor: Colors.grayColor,
            height: 1.0,
            flex: 1,
          }}
        />
        <Text
          style={{
            ...Fonts.grayColor16SemiBold,
            marginHorizontal: Sizes.fixPadding - 5.0,
          }}
        >
          OR
        </Text>
        <View
          style={{
            backgroundColor: Colors.grayColor,
            height: 1.0,
            flex: 1,
          }}
        />
      </View>
    );
  }

  function dontHaveAccountInfo() {
    return (
      <View style={styles.dontHaveAccountInfoWrapStyle}>
        <Text style={{ ...Fonts.grayColor16SemiBold }}>
          Don't have an account?
        </Text>
        <Text
          onPress={() => navigation.push("Signup")}
          style={{
            marginLeft: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          Sign Up
        </Text>
      </View>
    );
  }

  function forgetPasswordText() {
    return <Text style={styles.forgetPasswordTextStyle}>Forget Password?</Text>;
  }

  function passwordTextField() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          ...styles.textFieldWrapStyle,
        }}
      >
        <TextInput
          secureTextEntry={securePassword}
          selectionColor={Colors.blackColor}
          value={password}
          onChangeText={(text) => updateState({ password: text })}
          placeholder="Password"
          placeholderTextColor={Colors.grayColor}
          style={{ ...Fonts.blackColor14SemiBold, flex: 1 }}
        />
        <MaterialCommunityIcons
          name={securePassword ? "eye" : "eye-off"}
          size={20}
          color={Colors.grayColor}
          onPress={() => updateState({ securePassword: !securePassword })}
        />
      </View>
    );
  }

  function emailOrMobileNoTextField() {
    return (
      <View
        style={{
          ...styles.textFieldWrapStyle,
          marginBottom: Sizes.fixPadding + 20.0,
        }}
      >
        <TextInput
          selectionColor={Colors.blackColor}
          value={emailOrMobileNo}
          onChangeText={(text) => updateState({ emailOrMobileNo: text })}
          placeholder="Email / Mobile"
          placeholderTextColor={Colors.grayColor}
          style={{ ...Fonts.blackColor14SemiBold }}
        />
      </View>
    );
  }

  function signinTitle() {
    return (
      <Text
        style={{
          ...Fonts.blackColor20Bold,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: StatusBar.currentHeight + 15.0,
        }}
      >
        Sign In
      </Text>
    );
  }

  function loginWithGoogleButton() {
    return (
      <View style={styles.loginWithGoogleButtonStyle}>
        <Image
          source={require("../../../assets/images/google.png")}
          style={{ height: 30.0, width: 30.0 }}
          resizeMode="cover"
        />
        <Text
          style={{
            ...Fonts.blackColor17Regular,
            marginLeft: Sizes.fixPadding + 5.0,
          }}
        >
          Log in with Google
        </Text>
      </View>
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
  textFieldWrapStyle: {
    backgroundColor: Colors.backColor,
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 2.0,
    elevation: 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  socialMediaOptionsWrapStyle: {
    width: 35.0,
    height: 35.0,
    borderRadius: 17.5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding - 5.0,
  },
  orIndicatorWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding + 5.0,
  },
  forgetPasswordTextStyle: {
    ...Fonts.grayColor12Medium,
    alignSelf: "flex-end",
    marginHorizontal: Sizes.fixPadding * 4.0,
    marginTop: Sizes.fixPadding - 7.0,
  },
  dontHaveAccountInfoWrapStyle: {
    marginVertical: Sizes.fixPadding + 5.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signinButtonStyle: {
    backgroundColor: Colors.blackColor,
    paddingVertical: Sizes.fixPadding - 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    marginVertical: Sizes.fixPadding * 3.5,
  },
  loginWithGoogleButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    height: 55.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
});

export default SigninScreen;