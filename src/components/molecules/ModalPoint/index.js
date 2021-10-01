import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../utils";

const ModalPoint = ({ image, point, visible, onClose }) => {
  return (
    <Modal animationType="fade" visible={visible} transparent>
      <View style={styles.container}>
        <View>
          <Image style={styles.image} source={{ uri: image }} />
          <TouchableOpacity activeOpacity={1} style={styles.btn}>
            <Text style={styles.textPoint}>Point Anda: {point}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onClose && onClose()}
            activeOpacity={0.8}
            style={styles.btnClose}
          >
            <Text style={{ fontSize: 16 }}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalPoint;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.loadingBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: Dimensions.get("screen").height / 2,
    width: Dimensions.get("screen").width - 80,
  },
  btn: {
    height: 60,
    width: Dimensions.get("screen").width - 84,
    backgroundColor: "#FEB125",
    borderRadius: 200,
    position: "absolute",
    bottom: 42,
    alignItems: "center",
    justifyContent: "center",
    left: 3,
  },
  textPoint: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  btnClose: {
    height: 40,
    width: 40,
    borderRadius: 200,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: -8,
    top: -12,
  },
});
