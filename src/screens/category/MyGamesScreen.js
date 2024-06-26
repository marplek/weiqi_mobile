import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import SGFConverter from "../../utils/JGO/SGF";
import { timeAgo } from "../../utils/timeAgo";
import GoBoardPreview from "../../components/WeiqiBoard/GoBoardPreview";
import { useFocusEffect } from "@react-navigation/native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
const MyGamesScreen = ({ navigation }) => {
  const [savedGames, setSavedGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchSavedGames = async (pageNum) => {
    setLoading(true);
    try {
      const savedGamesJSON = await SecureStore.getItemAsync("savedGames");
      let savedGamesArray = JSON.parse(savedGamesJSON) || [];
      savedGamesArray.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      savedGamesArray = savedGamesArray.slice(0, pageNum * pageSize);

      if (pageNum === 1) {
        setSavedGames(savedGamesArray);
      } else {
        setSavedGames((prevGames) => [
          ...prevGames,
          ...savedGamesArray.slice((pageNum - 1) * pageSize),
        ]);
      }

      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchSavedGames(1);
    }, [])
  );

  const loadMoreGames = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const renderItem = ({ item }) => {
    const record = SGFConverter.toRecord(item.sgf);
    const stones = record.currentNode.board;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Game", {
            data: item,
          })
        }
        style={styles.touchableOpacityContainer}
      >
        <GoBoardPreview stones={stones} width={200} height={200} />
        <View style={styles.gameInfoContainer}>
          <View style={styles.gameDetailsContainer}>
            <Text style={styles.gameInfoText}>
              Black: {record.metaData.blackPlayer}
            </Text>
            <Text style={styles.gameInfoText}>
              White: {record.metaData.whitePlayer}
            </Text>
            <Text style={styles.gameInfoText}>
              Result: {record.metaData.result}
            </Text>
          </View>
          <View style={styles.timestampAndPermissionContainer}>
            <Text style={styles.permissionText}>{item.permission}</Text>
            <Text style={styles.updatedTimeText}>
              {timeAgo(item.timestamp)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <Text style={{ ...Fonts.blackColor22Bold }}>Games</Text>
        <MaterialIcons
          name="search"
          size={26}
          color="black"
          onPress={() => navigation.push("Search")}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {header()}
      <FlatList
        data={savedGames}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={loadMoreGames}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading ? <ActivityIndicator size="medium" color="gray" /> : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: Sizes.fixPadding + 10.0,
    paddingRight: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
  },
  touchableOpacityContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
  gameInfoContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "space-between",
  },
  gameInfoText: {
    fontSize: 14,
    color: "black",
  },
  timestampAndPermissionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  permissionText: {
    fontSize: 14,
    color: "gray",
  },
  updatedTimeText: {
    fontSize: 14,
    color: "gray",
  },
});

export default MyGamesScreen;
