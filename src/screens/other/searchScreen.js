import React, { createRef, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Fonts, Colors, Sizes } from "../../constants/styles";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const recentSearchesList = [
  {
    id: "1",
    image: require("../../../assets/images/search/table.png"),
    search: "Wedding Table",
    city: "Baroda",
    area: "Sherkhi",
    rating: 5.0,
  },
  {
    id: "2",
    image: require("../../../assets/images/search/hall.png"),
    search: "Wedding Hall",
    city: "Baroda",
    area: "Sherkhi",
    rating: 5.0,
  },
  {
    id: "3",
    image: require("../../../assets/images/search/club.png"),
    search: "Wedding Club",
    city: "Baroda",
    area: "Sherkhi",
    rating: 5.0,
  },
];

const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {searchFieldWithIcons()}
        {recentSearchesInfo()}
      </View>
    </SafeAreaView>
  );

  function recentSearchesInfo() {
    const renderItem = ({ item }) => (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("VendorDetail", { item })}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Image
            source={item.image}
            style={{
              width: 80,
              height: 80,
              borderRadius: Sizes.fixPadding - 5.0,
            }}
          />
          <View style={{ marginLeft: Sizes.fixPadding + 2.0 }}>
            <Text style={{ ...Fonts.blackColor17SemiBold }}>{item.search}</Text>
            <View
              style={{
                marginVertical: Sizes.fixPadding - 5.0,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="ios-location-outline"
                size={15}
                color={Colors.grayColor}
              />
              <Text style={{ lineHeight: 15.0, ...Fonts.grayColor14Medium }}>
                {item.area}, {item.city}
              </Text>
            </View>
            {showRating({ number: item.rating })}
          </View>
        </TouchableOpacity>
        {divider()}
      </View>
    );

    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding + 5.0,
            ...Fonts.blackColor18Bold,
          }}
        >
          Recent searches
        </Text>
        <FlatList
          data={recentSearchesList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
        />
      </View>
    );
  }

  function showRating({ number }) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {
          <MaterialIcons
            name="star"
            size={15}
            style={{ marginRight: Sizes.fixPadding - 8.0 }}
            color={
              number == 5.0 ||
              number == 4.0 ||
              number == 3.0 ||
              number == 2.0 ||
              number == 1.0
                ? Colors.ratingColor
                : Colors.grayColor
            }
          />
        }
        {
          <MaterialIcons
            name="star"
            size={15}
            style={{ marginRight: Sizes.fixPadding - 8.0 }}
            color={
              number == 5.0 || number == 4.0 || number == 3.0 || number == 2.0
                ? Colors.ratingColor
                : Colors.grayColor
            }
          />
        }
        {
          <MaterialIcons
            name="star"
            size={15}
            style={{ marginRight: Sizes.fixPadding - 8.0 }}
            color={
              number == 5.0 || number == 4.0 || number == 3.0
                ? Colors.ratingColor
                : Colors.grayColor
            }
          />
        }
        {
          <MaterialIcons
            name="star"
            size={15}
            style={{ marginRight: Sizes.fixPadding - 8.0 }}
            color={
              number == 5.0 || number == 4.0
                ? Colors.ratingColor
                : Colors.grayColor
            }
          />
        }
        {
          <MaterialIcons
            name="star"
            size={15}
            style={{ marginRight: Sizes.fixPadding - 8.0 }}
            color={number == 5.0 ? Colors.ratingColor : Colors.grayColor}
          />
        }
      </View>
    );
  }

  function searchFieldWithIcons() {
    const textInputRef = createRef();
    return (
      <View
        style={{
          marginBottom: Sizes.fixPadding,
          marginTop: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="search"
              size={20}
              color={Colors.grayColor}
              onPress={() => textInputRef.current.focus()}
              style={{ marginRight: Sizes.fixPadding - 3.0 }}
            />
            <TextInput
              value={search}
              ref={textInputRef}
              selectionColor={Colors.primaryColor}
              placeholder="Search here"
              style={{ ...Fonts.blackColor15Medium, flex: 1 }}
              placeholderTextColor={Colors.grayColor}
              onChangeText={(text) => setSearch(text)}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="close"
              color={Colors.grayColor}
              size={24}
              onPress={() => textInputRef.current.clear()}
            />
          </View>
        </View>
        {divider()}
      </View>
    );
  }

  function divider() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding + 5.0,
          backgroundColor: Colors.grayColor,
          height: 1.0,
        }}
      />
    );
  }
};

export default SearchScreen;
