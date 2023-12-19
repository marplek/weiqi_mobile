import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import SGFConverter from "../../utils/JGO/SGF";
import GoBoardPreview from "../../components/GoBoardPreview"; // Update the import path if necessary
import { useFocusEffect } from "@react-navigation/native";

const GamesScreen = ({ navigation }) => {
  const [savedGames, setSavedGames] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchSavedGames = async () => {
        const savedGamesJSON = await SecureStore.getItemAsync("savedGames");
        const savedGamesArray = JSON.parse(savedGamesJSON) || [];

        setSavedGames(savedGamesArray);
      };

      fetchSavedGames();
    }, [])
  );

  const renderItem = ({ item, index }) => {
    const record = SGFConverter.toRecord(item);
    const stones = record.currentNode.board;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("WeiqiBoardEdit", {
            record: JSON.stringify(item),
            gameIndex: index.toString(),
          })
        }
        style={styles.touchableOpacityContainer} // Apply the new styles
      >
        <GoBoardPreview stones={stones} width={100} height={100} />
      </TouchableOpacity>
    );
  };
  console.log(savedGames); // Add this line to log the item

  return (
    <View>
      <FlatList
        data={savedGames}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  touchableOpacityContainer: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
});

export default GamesScreen;
