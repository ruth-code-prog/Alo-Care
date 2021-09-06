import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../..";
import { IconFavoriteActive, IconFavoriteInactive } from "../../../assets";
import { Fire } from "../../../config";
import { colors, showError, showSuccess } from "../../../utils";

const ProductCard = ({ item, type, onRemove, onPress }) => {
  const [isLoading, setLoading] = useState(false);

  const handleChangeWishlist = () => {
    setLoading(true);
    const urlFirebase = `${type}/${item?.id}`;
    const urlWishlistFirebase = `wishlist/${type}/${item?.id}`;
    Fire.database()
      .ref(urlFirebase)
      .set({
        ...item,
        isWishlist: !item?.isWishlist,
      })
      .then(() => {
        if (item?.isWishlist) {
          Fire.database()
            .ref(urlWishlistFirebase)
            .remove()
            .then(() => {
              setLoading(false);
              onRemove && onRemove();
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
            .set({
              ...item,
              isWishlist: !item?.isWishlist,
            })
            .then(() => {
              setLoading(false);
              showSuccess("Berhasil menambahkan barang ke wishlist");
            })
            .catch((err) => {
              console.error(err);
              showError("Gagal menambahkan ke wishlist");
              setLoading(false);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        showError("Gagal mengubah wishlist");
        setLoading(false);
      });
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
            ) : item?.isWishlist ? (
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
