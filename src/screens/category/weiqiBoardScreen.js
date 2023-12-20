import React, { useState, useEffect, useCallback } from "react";
import WeiqiBoard from "../../components/WeiqiBoard/WeiqiBoard";
import NavigationButtons from "../../components/WeiqiBoard/NavigationButtons";
import MenuModal from "../../components/WeiqiBoard/MenuModal";
import MessageModal from "../../components/WeiqiBoard/MessageModal";
import BoardSettingsModal from "../../components/WeiqiBoard/BoardSettingsModal";
import { useTranslation } from "react-i18next";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import uuid from "react-native-uuid";

import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  BackHandler,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import Weiqi from "../../utils/JGO/Weiqi";
import Record from "../../utils/JGO/Record";
import SGFConverter from "../../utils/JGO/SGF";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const BOARD_SIZE = 19;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const boardWidth = Math.floor(SCREEN_WIDTH * 0.91);
const restWidth = Math.floor(SCREEN_WIDTH * 0.045);
const gridSpacing = boardWidth / (BOARD_SIZE - 1);

const WeiqiBoardScreen = ({ route }) => {
  const navigation = useNavigation();
  const [weiqi, setWeiqi] = useState(new Weiqi(BOARD_SIZE));
  const [stones, setStones] = useState(weiqi.getBoard());
  const [currentPlayer, setCurrentPlayer] = useState(weiqi.getCurrentPlayer());
  const [record, setRecord] = useState(new Record(weiqi.getBoard()));
  const [markers, setMarkers] = useState(record.getMarkers());
  const [modalVisible, setModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [boardSettingsVisible, setBoardSettingsVisible] = useState(false);
  const [gameId, setGameId] = useState(route.params?.data.id);
  const [recordMetaData, setRecordMetaData] = useState(record.getMetaData());
  const [addingBranch, setAddBranch] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedMode, setSelectedMode] = useState("normal");
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [currentMove, setCurrentMove] = useState(null);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [tempBranch, setTempBranch] = useState([]);
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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    if (record.currentNode) {
      record.currentNode.comment = comment;
    }
  }, [comment]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = async () => {
        if (await isBoardStateChanged()) {
          Alert.alert(
            t("saveChanges"),
            t("unsavedChanges"),
            [
              {
                text: t("cancel"),
                onPress: () => {},
                style: "cancel",
              },
              {
                text: t("dontSave"),
                onPress: () => navigation.goBack(),
              },
              {
                text: t("save"),
                onPress: async () => {
                  await handleSave();
                  navigation.goBack();
                },
              },
            ],
            { cancelable: false }
          );
          return true;
        } else {
          navigation.goBack();
          return true;
        }
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

  const handlePress = (event) => {
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;
    const col = Math.round((x - gridSpacing) / gridSpacing);
    const row = Math.round((y - gridSpacing) / gridSpacing);

    if (selectedMode === "branch") {
      weiqi.setBoard(record.getBoard());
      weiqi.setCurrentPlayer(currentPlayer);
      if (weiqi.placeStone(row, col)) {
        if (!tempBranch) {
          setTempBranch(new Record(record.currentNode.board));
        }
        tempBranch.addMove(weiqi.getBoard(), { row, col }, currentPlayer);
        setStones(tempBranch.currentNode.board);
        setCurrentPlayer(-tempBranch.currentNode.player);
      }
    } else if (
      selectedMode === "normal" &&
      record.currentNode.moveIndex === record.lastIndex
    ) {
      weiqi.setBoard(record.getBoard());
      weiqi.setCurrentPlayer(currentPlayer);
      if (weiqi.placeStone(row, col)) {
        record.addMove(weiqi.getBoard(), { row, col }, currentPlayer);
        setStones(record.getBoard());
        setCurrentPlayer(-record.currentNode.player);
        setComment(record.currentNode.comment || "");
        setMarkers(record.getMarkers());
        setCurrentMove(record.currentNode.position);
      }
    } else if (selectedMode === "cancel") {
      record.deleteMarkers({ row, col });
      setMarkers(JSON.parse(JSON.stringify(record.getMarkers())));
    } else if (selectedMode === "letter") {
      record.setMarkers({ row, col }, selectedMode, selectedLetter);
      setMarkers(JSON.parse(JSON.stringify(record.getMarkers())));
    } else {
      record.setMarkers({ row, col }, selectedMode);
      setMarkers(JSON.parse(JSON.stringify(record.getMarkers())));
      console.log(markers);
    }
  };

  const handleSave = async () => {
    try {
      const sgf = SGFConverter.toSGF(record);
      const savedGamesJSON = await SecureStore.getItemAsync("savedGames");
      let savedGames = JSON.parse(savedGamesJSON) || [];

      let gameIndex = savedGames.findIndex((game) => game.id === gameId);
      let gameData;

      if (gameIndex !== -1) {
        gameData = {
          ...savedGames[gameIndex],
          sgf: sgf,
          timestamp: new Date().toISOString(),
        };
        savedGames[gameIndex] = gameData;
      } else {
        gameData = {
          id: uuid.v4(),
          sgf: sgf,
          timestamp: new Date().toISOString(),
        };
        savedGames.push(gameData);
        setGameId(gameData.id);
      }

      await SecureStore.setItemAsync("savedGames", JSON.stringify(savedGames));
      Alert.alert("", t("gameSaved"), [{ text: "OK" }], { cancelable: true });
    } catch (error) {
      console.log(error);
      Alert.alert("", t("saveFailed"), [{ text: "OK" }], { cancelable: true });
    }
  };

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

    if (direction === "letter" && content) {
      setSelectedLetter(content);
    }
    if (direction === "mode" && content) {
      setSelectedMode(content);
    }
    if (direction === "saveBranch") {
      if (tempBranch) {
        record.merge(tempBranch);
        setTempBranch(null);
        setSelectedMode("normal");
      }
    } else if (direction === "deleteBranch") {
      if (tempBranch) {
        setStones(record.currentNode.board);
        setCurrentPlayer(record.currentNode.player);
        setTempBranch(null);
        setSelectedMode("normal");
      }
    }
  };

  const handleEditMessage = () => {
    setMessageModalVisible(true);
  };

  const toggleMessageModal = () => {
    setMessageModalVisible(!messageModalVisible);
  };

  const handleMessageSave = (message) => {
    setRecordMetaData(message);
    record.setMetaData(message);
    toggleMessageModal();
  };

  const resetBoardState = () => {
    const newWeiqi = new Weiqi(BOARD_SIZE);
    const newRecord = new Record(newWeiqi.getBoard());
    setWeiqi(newWeiqi);
    setStones(newWeiqi.getBoard());
    setCurrentPlayer(newWeiqi.getCurrentPlayer());
    setRecord(newRecord);
    setMarkers(newRecord.getMarkers());
    setCurrentMove(null);
  };

  const handleMenuItemPress = (item) => {
    switch (item) {
      case "new_record":
        Alert.alert(
          t("saveCurrentGame"),
          t("saveGamePrompt"),
          [
            {
              text: t("cancel"),
              onPress: () => {
                // Reset board state without saving
                resetBoardState();
              },
              style: "cancel",
            },
            {
              text: t("save"),
              onPress: async () => {
                // Save current board state and then reset
                await handleSave();
                resetBoardState();
              },
            },
          ],
          { cancelable: false }
        );
        break;

      case "edit_message":
        handleEditMessage();
        break;
      case "board_settings":
        setModalVisible(false);
        setBoardSettingsVisible(true);
        break;
      case "delete_record":
        Alert.alert(
          t("confirmDelete"),
          t("confirmDeleteMessage"),
          [
            {
              text: t("cancel"),
              style: "cancel",
            },
            {
              text: t("delete"),
              onPress: () => {
                if (route.params?.data) {
                  deleteRecord(route.params.data.id);
                } else {
                  navigation.goBack();
                }
              },
            },
          ],
          { cancelable: false }
        );
      default:
        break;
    }
    toggleModal();
  };

  const deleteRecord = async (gameId) => {
    try {
      let savedGamesJSON = await SecureStore.getItemAsync("savedGames");
      let savedGames = JSON.parse(savedGamesJSON) || [];
      const gameIndex = savedGames.findIndex((game) => game.id === gameId);

      if (gameIndex !== -1) {
        savedGames.splice(gameIndex, 1);
        await SecureStore.setItemAsync(
          "savedGames",
          JSON.stringify(savedGames)
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error("Failed to delete record:", error);
      Alert.alert(t("error"), t("deleteFailed"));
    }
  };

  const handleBoardSettingsOptionSelected = (option) => {
    console.log("Selected option:", option);
    setBoardSettingsVisible(false);
  };

  const isBoardStateChanged = async () => {
    const savedGamesJSON = await SecureStore.getItemAsync("savedGames");
    const savedGames = JSON.parse(savedGamesJSON) || [];
    const currentSGF = SGFConverter.toSGF(record);

    const existingGame = savedGames.find((game) => game.id === gameId);
    if (existingGame) {
      return currentSGF !== existingGame.sgf;
    }

    const newWeiqi = new Weiqi(BOARD_SIZE);
    const newRecord = new Record(newWeiqi.getBoard());
    const newSGF = SGFConverter.toSGF(newRecord);
    return currentSGF !== newSGF;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
      <View style={{ flex: 1 }}>
        {header()}
        {menuModal()}
        {messageModal()}
        <BoardSettingsModal
          visible={boardSettingsVisible}
          onRequestClose={() => setBoardSettingsVisible(false)}
          onOptionSelected={handleBoardSettingsOptionSelected}
        />
        <WeiqiBoard
          boardSize={BOARD_SIZE}
          SCREEN_WIDTH={SCREEN_WIDTH}
          stones={stones}
          markers={markers}
          onPress={handlePress}
          selectedLetter={selectedLetter}
          currentMove={currentMove}
        />
        <View>
          <TextInput
            style={styles.commentInput}
            placeholder={t("inputComment")}
            value={comment}
            onChangeText={setComment}
            maxLength={30}
            selectionColor="grey"
          />
        </View>
        <Text style={styles.sgfText} key={SGFConverter.toSGF(record)}>
          {SGFConverter.toSGF(record)}
        </Text>
        <Text style={styles.sgfText}>
          {selectedMode}
          {selectedLetter}
        </Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.navigationButtonsContainer}>
            <NavigationButtons
              onNavigate={handleNavigation}
              screenHeight={SCREEN_HEIGHT}
              setSelectedMode={setSelectedMode}
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
          onPress={async () => {
            if (await isBoardStateChanged()) {
              Alert.alert(
                t("saveChanges"),
                t("unsavedChanges"),
                [
                  {
                    text: t("cancel"),
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: t("dontSave"),
                    onPress: () => navigation.goBack(),
                    style: "destructive",
                  },
                  {
                    text: t("save"),
                    onPress: async () => {
                      await handleSave();
                      navigation.goBack();
                    },
                  },
                ],
                { cancelable: false }
              );
            } else {
              navigation.goBack();
            }
          }}
        />
        <View style={styles.rightIcons}>
          <MaterialIcons
            name="save"
            color={Colors.blackColor}
            size={Math.floor(SCREEN_HEIGHT * 0.045)}
            onPress={handleSave}
          />
          <MaterialIcons
            name="menu"
            color={Colors.blackColor}
            size={Math.floor(SCREEN_HEIGHT * 0.045)}
            onPress={toggleModal}
          />
        </View>
      </View>
    );
  }

  function menuModal() {
    return (
      <MenuModal
        visible={modalVisible}
        onRequestClose={toggleModal}
        onMenuItemPress={handleMenuItemPress}
      />
    );
  }
  function messageModal() {
    return (
      <MessageModal
        visible={messageModalVisible}
        onRequestClose={toggleMessageModal}
        onSave={handleMessageSave}
        defaultValues={recordMetaData}
      />
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
    justifyContent: "space-between",
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
});
export default WeiqiBoardScreen;
