import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gap,
  Header,
  ProductCard,
  UserInvestationCard,
} from "../../components";
import { Fire } from "../../config";
import { colors, fonts, useFormSoul } from "../../utils";

const ProductPage = () => {
  const { userHomeData, ourstaffs } = useRoute().params || {};

  const [products, setProducts] = useState([]);
  const [productsAll, setProductsAll] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [productsAll2, setProducts2All] = useState([]);
  const [products3, setProducts3] = useState([]);
  const [productsAll3, setProducts3All] = useState([]);
  const [searchProductLoading, setSearchProductLoading] = useState(false);
  const [searchProduct2Loading, setSearchProduct2Loading] = useState(false);
  const [searchProduct3Loading, setSearchProduct3Loading] = useState(false);

  const [memberData, setMemberData] = useState({});
  const [userWishlist, setUserWishlist] = useFormSoul({
    product1: [],
    product2: [],
    product3: [],
  });

  const navigation = useNavigation();

  useEffect(() => {
    getProducts();
    getMember();
    Fire.auth().onAuthStateChanged(async (data) => {
      if (data) {
        getWishlist(data?.uid);
      } else {
        AsyncStorage.clear();
      }
    });
  }, []);

  const getMember = () => {
    Fire.database()
      .ref(`member_alocare`)
      .limitToFirst(1)
      .once("value")
      .then((snapshot) => {
        const dataSnapshot = snapshot.val();
        if (dataSnapshot) {
          setMemberData(dataSnapshot?.filter((val) => val)[0]);
        }
      });
  };

  const getProducts = async () => {
    setSearchProductLoading(true);
    setSearchProduct2Loading(true);
    setSearchProduct3Loading(true);

    await Fire.database()
      .ref("produk")
      .on("value", (res) => {
        const arr = [...res.val()];
        setProducts(arr.filter((val) => val !== null));
        setProductsAll(arr.filter((val) => val !== null));
      });
    await Fire.database()
      .ref("produk2")
      .on("value", (res) => {
        const arr = [...res.val()];
        setProducts2(arr.filter((val) => val !== null));
        setProducts2All(arr.filter((val) => val !== null));
      });

    await Fire.database()
      .ref("produk3")
      .on("value", (res) => {
        const arr = [...res.val()];
        setProducts3(arr.filter((val) => val !== null));
        setProducts3All(arr.filter((val) => val !== null));
      });
    setSearchProductLoading(false);
    setSearchProduct2Loading(false);
    setSearchProduct3Loading(false);
  };

  const handleFilter = (val, productType) => {
    if (productType === "1") {
      setSearchProductLoading(true);
      let arr = [...productsAll];
      var searchRegex = new RegExp(val, "i");
      arr = arr.filter((item) => searchRegex?.test(item?.title));
      setProducts(arr);
      setTimeout(() => {
        setSearchProductLoading(false);
      }, 1500);
    } else if (productType === "2") {
      setSearchProduct2Loading(true);
      let arr = [...productsAll2];
      var searchRegex = new RegExp(val, "i");
      arr = arr.filter((item) => searchRegex?.test(item?.title));
      setProducts2(arr);
      setTimeout(() => {
        setSearchProduct2Loading(false);
      }, 1500);
    } else if (productType === "3") {
      setSearchProduct3Loading(true);
      let arr = [...productsAll3];
      var searchRegex = new RegExp(val, "i");
      arr = arr.filter((item) => searchRegex?.test(item?.title));
      setProducts3(arr);
      setTimeout(() => {
        setSearchProduct3Loading(false);
      }, 1500);
    }
  };

  const getWishlist = (uid) => {
    Fire.database()
      .ref(`users/${uid}/wishlist`)
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

        setUserWishlist({
          product1: arr1,
          product2: arr2,
          product3: arr3,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleBuy = (item) => {
    navigation.navigate("Chatting", {
      data: ourstaffs[0]?.data,
      chatContent: `Saya ingin membeli produk ${item?.title}`,
    });
  };

  const handleRemoveFavorite = (item, type) => {
    let arr = [...userWishlist[type]];
    arr = arr?.filter((val) => JSON.stringify(val) !== JSON.stringify(item));

    setUserWishlist({
      [type]: arr,
    });
  };

  const handleAddFavorite = (item, type) => {
    let arr = [...userWishlist[type]];
    arr?.push(item);
    setUserWishlist({
      [type]: arr,
    });
  };

  return (
    <SafeAreaView style={styles.pages}>
      <Header title="Produk" onPress={() => navigation.goBack()} />
      <ScrollView>
        <View>
          <Text
            style={{
              marginTop: 10,
              fontWeight: "bold",
              color: "#2d3436",
              marginHorizontal: 10,
            }}
          >
            Produk
          </Text>
          <Gap height={16} />
          <TextInput
            onChangeText={(val) => handleFilter(val, "1")}
            selectTextOnFocus
            style={styles.searchInput}
            placeholder="Cari Produk"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10, paddingHorizontal: 10 }}
        >
          {searchProductLoading ? (
            <ActivityIndicator
              size={40}
              color={colors.primary}
              style={{ marginVertical: 40, marginLeft: 40 }}
            />
          ) : (
            products?.map((item, index) => (
              <ProductCard
                onRemove={() => handleRemoveFavorite(item, "product1")}
                onAdd={() => handleAddFavorite(item, "product1")}
                product={userWishlist?.product1}
                uid={userHomeData?.uid}
                onPress={() => handleBuy(item)}
                type="produk"
                key={index}
                item={item}
              />
            ))
          )}
        </ScrollView>
        <View>
          <Text
            style={{
              marginTop: 10,
              fontWeight: "bold",
              color: "#2d3436",
              marginHorizontal: 10,
            }}
          >
            Makanan dan Minuman
          </Text>
          <Gap height={16} />
          <TextInput
            onChangeText={(val) => handleFilter(val, "2")}
            selectTextOnFocus
            style={styles.searchInput}
            placeholder="Cari Makanan dan Minuman"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10, paddingHorizontal: 10 }}
        >
          {searchProduct2Loading ? (
            <ActivityIndicator
              size={40}
              color={colors.primary}
              style={{ marginVertical: 40, marginLeft: 40 }}
            />
          ) : (
            products2?.map((item, index) => (
              <ProductCard
                onRemove={() => handleRemoveFavorite(item, "product2")}
                onAdd={() => handleAddFavorite(item, "product2")}
                product={userWishlist?.product2}
                uid={userHomeData?.uid}
                onPress={() => handleBuy(item)}
                type="produk2"
                key={index}
                item={item}
              />
            ))
          )}
        </ScrollView>
        <View>
          <Text
            style={{
              marginTop: 10,
              fontWeight: "bold",
              color: "#2d3436",
              marginHorizontal: 10,
            }}
          >
            Kosmetik dan Obat
          </Text>
          <Gap height={16} />
          <TextInput
            onChangeText={(val) => handleFilter(val, "3")}
            selectTextOnFocus
            style={styles.searchInput}
            placeholder="Cari Kosmetik dan Obat"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10, paddingHorizontal: 10 }}
        >
          {searchProduct3Loading ? (
            <ActivityIndicator
              size={40}
              color={colors.primary}
              style={{ marginVertical: 40, marginLeft: 40 }}
            />
          ) : (
            products3?.map((item, index) => (
              <ProductCard
                onRemove={() => handleRemoveFavorite(item, "product3")}
                onAdd={() => handleAddFavorite(item, "product3")}
                product={userWishlist?.product3}
                uid={userHomeData?.uid}
                onPress={() => handleBuy(item)}
                type="produk3"
                key={index}
                item={item}
              />
            ))
          )}
        </ScrollView>
        <View style={{ paddingHorizontal: 16, marginBottom: 40 }}>
          <View style={styles.userInvestationTitleContainer}>
            <Text style={styles.userInvestationTitle}>
              Reseller Produk Alo Care
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("MemberAlocare")}
            >
              <Text style={{ color: colors.primary }}>Lihat Semua </Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          <UserInvestationCard type="member" item={memberData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductPage;

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchInput: {
    borderWidth: 1,
    marginHorizontal: 16,
    borderRadius: 5,
    borderColor: colors.border,
  },
  userInvestationTitle: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    fontWeight: "bold",
  },
  userInvestationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
