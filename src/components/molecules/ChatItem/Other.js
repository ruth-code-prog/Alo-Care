import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { colors, fonts } from "../../../utils";
import ImageViewer from "react-native-image-zoom-viewer";
import { ILNullPhoto } from "../../../assets";

const Other = ({ text, date, photo, type, fullName }) => {
  const [modalZoom, setModalZoom] = useState(false);
  return (
    <View style={styles.container}>
      {photo?.uri ? (
        <Image source={photo} style={styles.avatar} />
      ) : (
        <Image source={ILNullPhoto} style={styles.avatar} />
      )}
      <View>
        <View style={[styles.chatContent, { paddingTop: fullName ? 4 : 12 }]}>
          {fullName ? (
            <View style={styles.fullNameContainer}>
              <Text style={styles.fullName}>{fullName}</Text>
            </View>
          ) : null}
          {type === "photo" ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setModalZoom(true)}
            >
              <Image
                source={{ uri: text }}
                style={{
                  width: Dimensions.get("screen").width / 3,
                  height: 240,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <Text style={styles.text}>{text}</Text>
          )}
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>
      {type === "photo" ? (
        <Modal visible={modalZoom} transparent={true}>
          <ImageViewer
            enableSwipeDown
            onSwipeDown={() => setModalZoom(false)}
            imageUrls={[{ url: text }]}
          />
        </Modal>
      ) : null}
    </View>
  );
};

export default Other;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: "flex-end",
    paddingLeft: 16,
    flexDirection: "row",
    maxWidth: "80%",
  },
  avatar: { width: 30, height: 30, borderRadius: 30 / 2, marginRight: 12 },
  chatContent: {
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 40,
    backgroundColor: colors.primary,
    maxWidth: "100%",
    borderRadius: 10,
    borderBottomLeftRadius: 0,
  },
  fullName: {
    fontSize: 14,
    fontFamily: fonts.primary[900],
    fontWeight: "bold",
    color: colors.tertiary,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.primary.normal,
    color: colors.white,
  },
  date: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginTop: 8,
  },
});
