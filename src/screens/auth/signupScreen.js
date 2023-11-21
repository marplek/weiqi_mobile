import React, { useState } from "react";
import {
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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const SignupScreen = ({ navigation }) => {
  const [state, setState] = useState({
    email: null,
    password: null,
    securePassword: false,
    name: null,
    mobileNo: null,
    confirmPassword: null,
    secureConfirmPassword: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const {
    email,
    password,
    securePassword,
    name,
    mobileNo,
    confirmPassword,
    secureConfirmPassword,
  } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("../../../assets/images/bg.png")}
          style={{ flex: 1 }}
        >
          {header()}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <ScrollView
              contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {nameTextField()}
              {emailTextField()}
              {mobileNoTextField()}
              {passwordTextField()}
              {confirmPasswordTextField()}
              {alreadyHaveAccountInfo()}
              {signupButton()}
              {orIndicator()}
              {loginWithGoogleButton()}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );

  function confirmPasswordTextField() {
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
          secureTextEntry={secureConfirmPassword}
          selectionColor={Colors.blackColor}
          value={confirmPassword}
          onChangeText={(text) => updateState({ confirmPassword: text })}
          placeholder="Confirm Password"
          placeholderTextColor={Colors.grayColor}
          style={{ ...Fonts.blackColor14SemiBold, flex: 1 }}
        />
        <MaterialCommunityIcons
          name={secureConfirmPassword ? "eye" : "eye-off"}
          size={20}
          color={Colors.grayColor}
          onPress={() =>
            updateState({ secureConfirmPassword: !secureConfirmPassword })
          }
        />
      </View>
    );
  }

  function mobileNoTextField() {
    return (
      <View
        style={{
          ...styles.textFieldWrapStyle,
        }}
      >
        <TextInput
          keyboardType="numeric"
          selectionColor={Colors.blackColor}
          value={mobileNo}
          onChangeText={(text) => updateState({ mobileNo: text })}
          placeholder="Mobile Number"
          placeholderTextColor={Colors.grayColor}
          style={{ ...Fonts.blackColor14SemiBold }}
        />
      </View>
    );
  }

  function nameTextField() {
    return (
      <View
        style={{
          ...styles.textFieldWrapStyle,
        }}
      >
        <TextInput
          selectionColor={Colors.blackColor}
          value={name}
          onChangeText={(text) => updateState({ name: text })}
          placeholder="Name"
          placeholderTextColor={Colors.grayColor}
          style={{ ...Fonts.blackColor14SemiBold }}
        />
      </View>
    );
  }

  function signupButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.push("Verification")}
        style={styles.signupButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor20Bold }}>Sign Up</Text>
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

  function alreadyHaveAccountInfo() {
    return (
      <View style={styles.alreadyHaveAccountInfoWrapStyle}>
        <Text style={{ ...Fonts.grayColor16SemiBold }}>
          Already have an account?
        </Text>
        <Text
          onPress={() => navigation.push("Signin")}
          style={{
            marginLeft: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          Sign In
        </Text>
      </View>
    );
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

  function emailTextField() {
    return (
      <View
        style={{
          ...styles.textFieldWrapStyle,
        }}
      >
        <TextInput
          selectionColor={Colors.blackColor}
          value={email}
          onChangeText={(text) => updateState({ email: text })}
          placeholder="Email"
          placeholderTextColor={Colors.grayColor}
          style={{ ...Fonts.blackColor14SemiBold }}
          keyboardType="email-address"
        />
      </View>
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
  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back-ios"
          color={Colors.blackColor}
          size={24}
          onPress={() => navigation.pop()}
        />
        <Text
          style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor20Bold }}
        >
          Sign Up
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: StatusBar.currentHeight + 15.0,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.fixPadding,
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
    marginBottom: Sizes.fixPadding + 20.0,
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
  alreadyHaveAccountInfoWrapStyle: {
    marginBottom: Sizes.fixPadding + 5.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonStyle: {
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

export default SignupScreen;
