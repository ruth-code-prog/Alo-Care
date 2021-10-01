import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Gap } from "..";
import { colors, fonts } from "../../../utils";

const ProductTransaction = ({ item }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.topContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item?.image || "",
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.itemQty}>
          Qty {item?.qty}X <Text style={styles.itemTitle}>{item?.title}</Text>
        </Text>
        <Text style={styles.desc}>{item?.desc}</Text>
      </View>
    </View>
  );
};

export default ProductTransaction;

const styles = StyleSheet.create({
  desc: {
    fontSize: 12,
    color: colors.text.subTitle,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  rightContainer: {
    flex: 1,
    marginLeft: 8,
  },
  topContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  itemQty: {
    fontSize: 16,
    fontFamily: fonts.primary[900],
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: fonts.primary[900],
    fontWeight: "bold",
  },
});