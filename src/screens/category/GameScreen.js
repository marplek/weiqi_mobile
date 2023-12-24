import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  BackHandler,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import WeiqiBoard from "../../components/WeiqiBoard/WeiqiBoard";
import NavigationButtons from "../../components/WeiqiBoard/NavigationButtons";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import Weiqi from "../../utils/JGO/Weiqi";
import Record from "../../utils/JGO/Record";
import SGFConverter from "../../utils/JGO/SGF";
import { Permission } from "../../utils/Game";

const BOARD_SIZE = 19;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const boardWidth = Math.floor(SCREEN_WIDTH * 0.91);
const restWidth = Math.floor(SCREEN_WIDTH * 0.045);
const gridSpacing = boardWidth / (BOARD_SIZE - 1);

const GameScreen = ({ route }) => {
  const navigation = useNavigation();
  const [weiqi, setWeiqi] = useState(new Weiqi(BOARD_SIZE));
  const [stones, setStones] = useState(weiqi.getBoard());
  const [currentPlayer, setCurrentPlayer] = useState(weiqi.getCurrentPlayer());
  const [record, setRecord] = useState(new Record(weiqi.getBoard()));
  const [markers, setMarkers] = useState(record.getMarkers());

  const [comment, setComment] = useState("");
  const [currentMove, setCurrentMove] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const fetchData = async () => {
    if (route.params?.data) {
      const newRecord = SGFConverter.toRecord(route.params.data.sgf);
      setRecord(newRecord);
      setStones(newRecord.getBoard());
      setMarkers(newRecord.getMarkers());
      setCurrentPlayer(newRecord.currentNode.player === 1 ? -1 : 1);
      setCurrentMove(newRecord.currentNode.position);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [route.params?.data])
  );
  useEffect(() => {
    if (record.currentNode) {
      record.currentNode.comment = comment;
    }
  }, [comment]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [record, navigation])
  );

  useEffect(() => {
    if (route.params?.data) {
      const newRecord = SGFConverter.toRecord(route.params.data.sgf);
      setRecord(newRecord);
      setStones(newRecord.getBoard());
      setMarkers(newRecord.getMarkers());
      setCurrentPlayer(newRecord.currentNode.player === 1 ? -1 : 1);
      setCurrentMove(newRecord.currentNode.position);
    }
  }, [route.params?.data]);

  const handleNavigation = (direction, content) => {
    if (
      direction === "prev5" ||
      direction === "next5" ||
      direction === "prev" ||
      direction === "next" ||
      direction === "delete"
    ) {
      let result;
      const showAlert = () => {
        Alert.alert(
          t("deleteWarning"),
          t("deleteConfirmation"),
          [
            {
              text: t("cancel"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: t("confirm"),
              onPress: () => {
                result = record.removeCurrentMove();
                if (result) {
                  setStones(record.currentNode.board);
                  setMarkers(record.currentNode.markers);
                  setCurrentMove(record.currentNode.position);
                  if (record.currentNode.parent) {
                    setCurrentPlayer(-record.currentNode.player);
                  } else {
                    setCurrentPlayer(1);
                  }
                }
              },
            },
          ],
          { cancelable: false }
        );
      };

      switch (direction) {
        case "prev5":
          result = record.moveBackwardBy(5);
          break;
        case "next5":
          result = record.moveForwardBy(5);
          break;
        case "prev":
          result = record.moveBackward();
          break;
        case "next":
          result = record.moveForward();
          break;
        case "delete":
          if (record.currentNode.moveIndex === record.lastIndex) {
            result = record.removeCurrentMove();
          } else {
            showAlert();
            return;
          }
          break;
        default:
          return;
      }

      if (result) {
        setStones(record.currentNode.board);
        setMarkers(record.currentNode.markers);
        if (record.currentNode.parent) {
          setCurrentPlayer(-record.currentNode.player);
        } else {
          setCurrentPlayer(1);
        }
        setComment(record.currentNode.comment || "");
        setComment(record.currentNode.comment || "");
        setCurrentMove(record.currentNode.position);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
      <View style={{ flex: 1 }}>
        {header()}

        <WeiqiBoard
          boardSize={BOARD_SIZE}
          SCREEN_WIDTH={SCREEN_WIDTH}
          stones={stones}
          markers={markers}
          currentMove={currentMove}
        />

        <Text>{comment}</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.navigationButtonsContainer}>
            <NavigationButtons
              onNavigate={handleNavigation}
              screenHeight={SCREEN_HEIGHT}
              simpleMode={true}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back"
          size={Math.floor(SCREEN_HEIGHT * 0.045)}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.rightIcons}>
          <MaterialIcons
            name="edit"
            color={Colors.blackColor}
            size={Math.floor(SCREEN_HEIGHT * 0.045)}
            onPress={() => {
              navigation.navigate("GameRecording", {
                data: route.params?.data,
              });
            }}
          />
        </View>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "right",
    width: Math.floor(SCREEN_HEIGHT * 0.08),
  },
  sgfText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "monospace",
    textAlign: "center",
  },
  navigationButtonsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  radioFormStyle: {
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  radioButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  radioLabel: {
    fontSize: 16,
    color: "#000", // change as needed
    marginLeft: 5,
  },
});
export default GameScreen;
