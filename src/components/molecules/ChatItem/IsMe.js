import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { colors, fonts } from "../../../utils";

const IsMe = ({ text, date, type }) => {
  const [modalZoom, setModalZoom] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.chatContent}>
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

export default IsMe;

const styles = StyleSheet.create({
  container: { marginBottom: 20, alignItems: "flex-end", paddingRight: 16 },
  chatContent: {
    padding: 12,
    paddingRight: 18,
    backgroundColor: colors.cardLight,
    maxWidth: "70%",
    borderRadius: 10,
    borderBottomRightRadius: 0,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.primary.normal,
    color: colors.text.primary,
  },
  date: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginTop: 8,
  },
});
