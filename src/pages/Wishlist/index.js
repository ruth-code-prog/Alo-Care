import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { ProductCard } from "../../components";
import DarkProfile from "../../components/molecules/Header/DarkProfile";
import { Fire } from "../../config";
import { colors } from "../../utils";

const Wishlist = ({ route }) => {
  const { adminData } = route?.params || {};
  const [product1, setProduct1] = useState([]);
  const [product2, setProduct2] = useState([]);
  const [product3, setProduct3] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    getWishlist();
  }, []);

  const filterWishlistProduct = (val, arr) => {
    if (val[1]?.length) {
      val[1]?.map((val2) => {
        if (val2) {
          arr.push(val2);
        }
      });
    } else {
      arr.push(val[1][Object.keys(val[1])]);
    }
  };

  const getWishlist = () => {
    Fire.database()
      .ref("wishlist")
      .once("value")
      .then((res) => {
        const snapshotRes = res.val();

        const arr1 = [];
        const arr2 = [];
        const arr3 = [];

        if (snapshotRes) {
          Object.entries(snapshotRes).map((val) => {
            if (val[0] === "produk") {
              filterWishlistProduct(val, arr1);
            } else if (val[0] === "produk2") {
              filterWishlistProduct(val, arr2);
            } else if (val[0] === "produk3") {
              filterWishlistProduct(val, arr3);
            }
          });
        }

        setProduct1(arr1);
        setProduct2(arr2);
        setProduct3(arr3);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onRemove = (item, product, setProduct) => {
    let arr = [...product];
    arr = arr.filter((val) => val !== item);
    setProduct(arr);
  };

  const handleBuy = (item) => {
    navigation.navigate("Chatting", {
      data: adminData,
      chatContent: `Saya ingin membeli produk ${item?.title}`,
    });
  };

  return (
    <View style={styles.pages}>
      <DarkProfile
        onPress={() => navigation.goBack()}
        title="Wishlist"
        desc="Wishlist barang kamu"
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginVertical: 16 }}>
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Produk 1</Text>
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            data={product1}
            horizontal
            renderItem={({ item }) => (
              <ProductCard
                onPress={() => handleBuy(item)}
                onRemove={() => onRemove(item, product1, setProduct1)}
                type="produk"
                item={item}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ItemSeparatorComponent={() => <View style={{ marginRight: 8 }} />}
          />
        </View>
        <View style={{ marginVertical: 16 }}>
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Produk 2</Text>
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            data={product2}
            horizontal
            renderItem={({ item }) => (
              <ProductCard
                onPress={() => handleBuy(item)}
                onRemove={() => onRemove(item, product2, setProduct2)}
                type="produk2"
                item={item}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ItemSeparatorComponent={() => <View style={{ marginRight: 8 }} />}
          />
        </View>
        <View style={{ marginVertical: 16 }}>
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Produk 3</Text>
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            data={product3}
            horizontal
            renderItem={({ item }) => (
              <ProductCard
                onPress={() => handleBuy(item)}
                onRemove={() => onRemove(item, product3, setProduct3)}
                type="produk3"
                item={item}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ItemSeparatorComponent={() => <View style={{ marginRight: 8 }} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
