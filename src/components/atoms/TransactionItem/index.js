import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Gap, ProductTransaction } from "..";
import { colors, fonts } from "../../../utils";

const TransactionItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <ProductTransaction item={item?.produk[0]} />
      {item?.produk?.length > 1 ? (
        <View style={{ alignItems: "center" }}>
          <Gap height={8} />
          <Text style={styles.exceedProduct}>
            +{item?.produk?.length - 1} Produk Lainnya
          </Text>
        </View>
      ) : null}
      <Gap height={24} />
      <Button
        onPress={() => navigation.navigate("TransactionDetail", { item })}
        title="Lihat Detail Transaksi"
      />
    </TouchableOpacity>
  );
};

export default TransactionItem;

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
  exceedProduct: {
    color: "grey",
    fontSize: 12,
  },
});