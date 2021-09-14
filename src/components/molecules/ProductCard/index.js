import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Button } from "../..";
import { IconFavoriteActive, IconFavoriteInactive } from "../../../assets";
import { Fire } from "../../../config";
import { colors, showError, showSuccess } from "../../../utils";

const ProductCard = ({
  item,
  type,
  onRemove,
  onPress,
  uid,
  product,
  onAdd,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isWishlist, setWishlist] = useState(false);

  useEffect(() => {
    setWishlist(product.filter((val) => val?.image == item?.image)?.length > 0);
  }, []);

  const handleChangeWishlist = () => {
    setLoading(true);
    const urlWishlistFirebase = `users/${uid}/wishlist/${type}/${item?.id}`;
    if (product.filter((val) => val?.image == item?.image)?.length > 0) {
      Fire.database()
        .ref(urlWishlistFirebase)
        .remove()
        .then(() => {
          console.log("ha");
          setLoading(false);
          onRemove && onRemove();
          setWishlist(!isWishlist);
          showSuccess("Berhasil menghapus barang dari wishlist");
        })
        .catch((err) => {
          console.error(err);
          showError("Gagal menghapus dari wishlist");
          setLoading(false);
        });
    } else {
      Fire.database()
        .ref(urlWishlistFirebase)
        .set(item)
        .then(() => {
          setLoading(false);
          setWishlist(!isWishlist);
          onAdd && onAdd();
          showSuccess("Berhasil menambahkan barang ke wishlist");
        })
        .catch((err) => {
          console.error(err);
          showError("Gagal menambahkan ke wishlist");
          setLoading(false);
        });
    }
  };

  return (
    <View
      style={[
        {
          width: 300,
          borderRadius: 10,
          marginRight: 10,
          marginBottom: 24,
          backgroundColor: colors.white,
        },
        styles.shadow,
      ]}
    >
      <Image
        source={{
          uri: item?.image || "",
        }}
        style={{
          width: 300,
          height: 200,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />
      <View
        style={{
          padding: 20,
          backgroundColor: "white",
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      >
        <View style={styles.rowBetweenCenter}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "300",
              color: "#636e72",
              flex: 1,
            }}
          >
            {item?.lokasi}
          </Text>
          <TouchableOpacity
            onPress={() => (isLoading ? {} : handleChangeWishlist())}
          >
            {isLoading ? (
              <ActivityIndicator size={18} color={colors.primary} />
            ) : isWishlist ? (
              <IconFavoriteActive />
            ) : (
              <IconFavoriteInactive />
            )}
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            color: "#2d3436",
            marginTop: 8,
          }}
        >
          {item?.title}
        </Text>
        <Text
          numberOfLines={3}
          ellipsizeMode={"tail"}
          style={{
            fontSize: 10,
            fontWeight: "300",
            color: "#636e72",
          }}
        >
          {item?.desc}
        </Text>
        <View style={{ marginTop: 16 }}>
          <Button onPress={() => onPress && onPress(item)} title="Beli" />
        </View>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  rowBetweenCenter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
