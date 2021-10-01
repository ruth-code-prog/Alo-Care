import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../utils";

const CircleStory = ({ data }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Chatting", {
            data,
          })
        }
        activeOpacity={0.8}
        style={styles.storyImageContainer}
      >
        {data?.photo ? (
          <Image
            source={{
              uri: data?.photo,
            }}
            style={styles.storyImage}
          />
        ) : (
          <Image
            source={require("../../../assets/illustration/null-photo.png")}
            style={styles.storyImage}
          />
        )}
      </TouchableOpacity>
      <Text
        numberOfLines={1}
        lineBreakMode="tail"
        style={{ textAlign: "center" }}
      >
        {data?.fullName}
      </Text>
    </View>
  );
};

export default CircleStory;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    maxWidth: 100,
  },
  storyImageContainer: {
    borderRadius: 200,
    overflow: "hidden",
    height: 80,
    width: 80,
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  storyImage: {
    height: 70,
    borderRadius: 200,
    width: 70,
  },
});