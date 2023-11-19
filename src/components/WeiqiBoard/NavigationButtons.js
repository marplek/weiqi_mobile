import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import ModalDropdown from "react-native-modal-dropdown";
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const NavigationButtons = ({ onNavigate, proTool = true, setSelectedMode }) => {
  const [isToolVisible, setIsToolVisible] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [currentSelectedMode, setCurrentSelectedMode] = useState("normal");
  const [showSaveDeleteIcons, setShowSaveDeleteIcons] = useState(false);

  const mode = {
    "circle-half-full": "normal",
    "git-merge": "branch",
    "circle-outline": "cir",
    "triangle-outline": "tri",
    "rectangle-outline": "rec",

    close: "clo",
    letter: "letter",
    cancel: "cancel",
  };

  const handleModeSelect = (iconName) => {
    setCurrentSelectedMode(mode[iconName]);
    onNavigate("mode", mode[iconName]);

    if (iconName === "git-merge") {
      setShowSaveDeleteIcons(true);
    }
  };

  const handleLetterSelect = (value) => {
    setSelectedLetter(value);
    setSelectedMode("letter"); // Set mode to 'letter'
    setCurrentSelectedMode("letter"); // Add this line
    onNavigate("letter", value); // Send the selected letter to the parent component
  };

  const toggleTool = () => {
    setIsToolVisible(!isToolVisible);
  };

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const toolIcons = [
    { name: "circle-half-full", type: "material-community" },
    { name: "git-merge", type: "feather" },
    { name: "circle-outline", type: "material-community" },
    { name: "triangle-outline", type: "material-community" },
    { name: "rectangle-outline", type: "material-community" },
    { name: "close", type: "material-community" },
  ];
  const gitMergeIndex = toolIcons.findIndex(
    (icon) => icon.name === "git-merge"
  );
  const navIcons = [
    { name: "delete", type: "material", action: "delete" },
    { name: "angle-double-left", type: "font-awesome", action: "prev5" },
    { name: "angle-left", type: "font-awesome", action: "prev" },
    { name: "angle-right", type: "font-awesome", action: "next" },
    { name: "angle-double-right", type: "font-awesome", action: "next5" },
    proTool && { name: "more-horiz", type: "material", action: "toggleTool" },
  ].filter(Boolean);

  return (
    <SafeAreaView style={styles.safeArea}>
      {isToolVisible && (
        <View style={styles.toolContainer}>
          {toolIcons.map((icon, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => handleModeSelect(icon.name)}
                style={[
                  styles.toolButton,
                  currentSelectedMode === mode[icon.name]
                    ? styles.selectedMode
                    : null,
                ]}
              >
                <Icon
                  name={icon.name}
                  type={icon.type}
                  size={Math.floor(screenHeight * 0.05)}
                />
              </TouchableOpacity>
              {showSaveDeleteIcons && index === gitMergeIndex && (
                <View style={styles.saveDeleteContainer}>
                  <TouchableOpacity onPress={() => onNavigate("saveBranch")}>
                    <Icon
                      name="save"
                      type="font-awesome"
                      size={Math.floor(screenHeight * 0.05)}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onNavigate("deleteBranch")}>
                    <Icon
                      name="delete"
                      type="material"
                      size={Math.floor(screenHeight * 0.05)}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          <TouchableOpacity
            onPress={() => handleModeSelect("letter")}
            style={[
              styles.toolButton,
              styles.toolButtonModalDropdown,
              currentSelectedMode === mode["letter"]
                ? styles.selectedMode
                : null,
            ]}
          >
            <View
              style={[
                styles.toolButton,
                currentSelectedMode === mode["letter"]
                  ? styles.selectedMode
                  : null,
              ]}
            >
              <ModalDropdown
                defaultValue={selectedLetter}
                options={letters}
                onSelect={(index, value) => handleLetterSelect(value)}
                onDropdownWillShow={() => handleModeSelect("letter")}
                dropdownTextStyle={{
                  fontSize: Math.floor(screenHeight * 0.02),
                  textAlign: "center",
                }}
                textStyle={styles.modalDropdownText}
                adjustFrame={(style) => ({ ...style, top: style.top })}
                style={styles.toolButtonModalDropdown}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleModeSelect("cancel")}
            style={[
              styles.toolButton,
              currentSelectedMode === mode["cancel"]
                ? styles.selectedMode
                : null,
            ]}
          >
            <Icon
              name={"cancel"}
              type={"material-community"}
              size={Math.floor(screenHeight * 0.05)}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {navIcons.map((icon, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              icon.action === "toggleTool"
                ? toggleTool()
                : onNavigate(icon.action);
            }}
          >
            <Icon
              name={icon.name}
              type={icon.type}
              size={Math.floor(screenHeight * 0.05)}
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  toolContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  toolButton: {
    padding: 5,
  },
  toolButtonModalDropdown: {
    width: Math.floor(screenWidth / 8 - 10), // Increase the width slightly
    height: Math.floor(screenHeight * 0.05), // Set a fixed height
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
  },
  selectedMode: {
    backgroundColor: "lightgray",
    borderRadius: 10,
    padding: 5, // Move padding from toolButton to selectedMode
  },
  modalDropdownText: {
    fontSize: Math.floor(screenHeight * 0.04), // 放大選擇的英文字
    textAlign: "center",
  },
  saveDeleteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    left: -10,
    right: 0,
    top: -Math.floor(screenHeight * 0.05),
  },
});
export default NavigationButtons;
