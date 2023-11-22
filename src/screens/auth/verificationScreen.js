import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Circle } from "react-native-animated-spinkit";
import OTPTextView from "react-native-otp-textinput";
import { Overlay } from "@rneui/themed";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const VerificationScreen = ({ navigation }) => {
  const [otpInput, setotpInput] = useState("");
  const [isLoading, setisLoading] = useState(false);

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
              {optInfo()}
              {otpFields()}
              {resendInfo()}
              {doneButton()}
            </ScrollView>
            {loading()}
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );

  function loading() {
    return (
      <Overlay
        isVisible={isLoading}
        overlayStyle={{
          padding: 0.0,
          width: "80%",
          borderRadius: Sizes.fixPadding - 5.0,
        }}
      >
        <View style={styles.dialogWrapStyle}>
          <Circle size={40} color={Colors.blackColor} />
          <Text
            style={{
              ...Fonts.grayColor16SemiBold,
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            Please Wait..
          </Text>
        </View>
      </Overlay>
    );
  }

  function doneButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setisLoading(true);
          setTimeout(() => {
            setisLoading(false);
            navigation.push("BottomTabBar");
          }, 2000);
        }}
        style={styles.doneButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor20Bold }}>Done</Text>
      </TouchableOpacity>
    );
  }

  function resendInfo() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ ...Fonts.blackColor14SemiBold }}>
          Didn't receive OTP Code?
        </Text>
        <Text
          style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Bold }}
        >
          Resend
        </Text>
      </View>
    );
  }

  function otpFields() {
    return (
      <OTPTextView
        containerStyle={{
          marginHorizontal: Sizes.fixPadding * 5.0,
          marginVertical: Sizes.fixPadding + 15.0,
        }}
        handleTextChange={(text) => {
          setotpInput(text);
          if (otpInput.length == 3) {
            setisLoading(true);
            setTimeout(() => {
              setisLoading(false);
              navigation.push("BottomTabBar");
            }, 2000);
          }
        }}
        inputCount={4}
        keyboardType="numeric"
        tintColor={Colors.blackColor}
        textInputStyle={{ ...styles.textFieldStyle }}
      />
    );
  }

  function optInfo() {
    return (
      <Text
        style={{
          ...Fonts.blackColor13Bold,
          textAlign: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        Enter the otp code from the phone we just sent you
      </Text>
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
          Verification
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
  textFieldStyle: {
    borderBottomWidth: null,
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.whiteColor,
    borderWidth: 1.0,
    ...Fonts.blackColor15Medium,
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
  doneButtonStyle: {
    backgroundColor: Colors.blackColor,
    paddingVertical: Sizes.fixPadding - 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    marginVertical: Sizes.fixPadding * 2.5,
  },
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding - 5.0,
    padding: Sizes.fixPadding + 5.0,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
  },
});

export default VerificationScreen;
