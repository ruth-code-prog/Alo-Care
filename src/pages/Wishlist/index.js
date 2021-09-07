import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { ProductCard } from "../../components";
import DarkProfile from "../../components/molecules/Header/DarkProfile";
import { colors } from "../../utils";

const Wishlist = ({ route }) => {
  const { adminData, wishlist, uid } = route?.params || {};
  const [product1, setProduct1] = useState([]);
  const [product2, setProduct2] = useState([]);
  const [product3, setProduct3] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    setProduct1(wishlist?.product1);
    setProduct2(wishlist?.product2);
    setProduct3(wishlist?.product3);
  }, []);

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
                uid={uid}
                product={product1}
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
                uid={uid}
                product={product2}
                onPress={() => handleBuy(item)}
                onRemove={() => {
                  console.log(item);
                  onRemove(item, product2, setProduct2);
                }}
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
                uid={uid}
                product={product3}
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
