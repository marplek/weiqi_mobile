import React, { useState } from "react";
import { SafeAreaView, Dimensions } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";

const { width } = Dimensions.get("screen");

const ProfileScreen = ({ navigation }) => {
  const [showLogoutDialog, setshowLogoutDialog] = useState(false);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.backColor }}
    ></SafeAreaView>
  );
};

export default ProfileScreen;
