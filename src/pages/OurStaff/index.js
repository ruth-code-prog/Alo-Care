import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect, useState, useRef, memo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyFormatter from "react-native-currency-formatter";
import TextTicker from "react-native-text-ticker";
import { useSelector } from "react-redux";
import { IconFavoriteActive, ILNullPhoto } from "../../assets";
import {
  BannerSlider,
  Gap,
  HomeProfile,
  NewsItem,
  OurStaffCategory,
  ProductCard,
  RatedOurStaff,
  WebItem,
} from "../../components";
import { Fire } from "../../config";
import { colors, fonts, getData, showError, storeData } from "../../utils";

const MemoView = memo(View);
const MemoTouchableOpacity = memo(TouchableOpacity);

const OurStaff = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [web, setWeb] = useState([]);
  const [categoryOurstaff, setCategoryOurstaff] = useState([]);
  const [ourstaffs, setOurstaffs] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsAll, setProductsAll] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [productsAll2, setProducts2All] = useState([]);
  const [products3, setProducts3] = useState([]);
  const [productsAll3, setProducts3All] = useState([]);
  const [searchProductLoading, setSearchProductLoading] = useState(false);
  const [searchProduct2Loading, setSearchProduct2Loading] = useState(false);
  const [searchProduct3Loading, setSearchProduct3Loading] = useState(false);
  const [userHomeData, setUserHomeData] = useState({});

  const [banners, setBanners] = useState([]);
  const [runningText, setRunningText] = useState(null);

  const { token } = useSelector((state) => state.fcm);
  const [profile, setProfile] = useState({
    photo: ILNullPhoto,
    fullName: "",
    profession: "",
  });

  useEffect(() => {
      getCategoryOurstaff();
    getTopRatedOurstaffs();
    console.log("aa", ourstaffs[0]);
      getNews();
      getWeb();

      navigation.addListener("focus", () => {
        getUserData();
      });
  }, [navigation]);

  useEffect(() => {
    Fire.auth().onAuthStateChanged(async (data) => {
      if (data) {
        getUserHomeData(data.uid);
      }
    });
    getBanners();
    getProducts();
    getRunningText();
    getUserList();
  }, []);

  const getUserList = () => {
    Fire.database()
      .ref("users/")
      .once("value")
      .then(async (res) => {
        if (res.val()) {
          const data = res.val();
          const realData = [];
          Object.entries(data).map((val) => {
            realData.push({ data: val[1] });
          });
          const filterData = realData?.filter((val) => val?.data?.uid);
          storeData("userList", filterData);
        }
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  const getTopRatedOurstaffs = () => {
    Fire.database()
      .ref("ourstaffs/")
      .orderByChild("rate")
      .limitToLast(3)
      .once("value")
      .then((res) => {
        if (res.val()) {
          const oldData = res.val();
          const data = [];
          Object.keys(oldData).map((key) => {
            data.push({
              id: key,
              data: oldData[key],
            });
          });
          setOurstaffs(data);
        }
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  const getCategoryOurstaff = () => {
    Fire.database()
      .ref("category_ourstaff/")
      .once("value")
      .then((res) => {
        if (res.val()) {
          const data = res.val();
          const filterData = data.filter((el) => el !== null);
          setCategoryOurstaff(filterData);
        }
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  const getNews = () => {
    Fire.database()
      .ref("news/")
      .once("value")
      .then((res) => {
        if (res.val()) {
          const data = res.val();
          const filterData = data.filter((el) => el !== null);
          setNews(filterData);
        }
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  const getWeb = () => {
    Fire.database()
      .ref("webs/")
      .once("value")
      .then((res) => {
        if (res.val()) {
          const data = res.val();
          const filterData = data.filter((el) => el !== null);
          setWeb(filterData);
        }
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  const getUserData = () => {
    getData("user").then((res) => {
      const data = res;
      data.photo = res?.photo?.length > 1 ? { uri: res.photo } : ILNullPhoto;
      setProfile(res);
    });
  };

  useEffect(() => {
    const setTokenToFirebase = async () => {
      let userdata = await getData("user");
      if (userdata) {
        const data = {
          fullName: userdata.fullName,
          profession: userdata.profession,
          email: userdata.email,
          uid: userdata.uid,
          token: token,
          photo: userdata.photo,
          photoForDB: userdata.photoForDB,
          point: userdata.point,
          tenor1: userdata.tenor1,
          tagihan1: userdata.tagihan1,
          tempo1: userdata.tempo1,
          tenor2: userdata.tenor2,
          tagihan2: userdata.tagihan2,
          tempo2: userdata.tempo2,
          tenor3: userdata.tenor3,
          tagihan3: userdata.tagihan3,
          tempo3: userdata.tempo3,
        };
        Fire.database().ref(`users/${userdata.uid}/`).update({ token: token });
        storeData("user", data);
      }
    };
    setTokenToFirebase();
  }, []);

  const getUserHomeData = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserHomeData(snapshot.val());
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

  const getBanners = () => {
    Fire.database()
      .ref("desain_banner")
      .once("value")
      .then((res) => {
        const arr = [...res.val()];
        const filteredArr = arr.filter((val) => val !== null);
        const newArr = filteredArr?.map((val) => val?.image);
        console.log("bannerss", newArr);
        setBanners(newArr);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getRunningText = () => {
    Fire.database()
      .ref("text")
      .once("value")
      .then((res) => {
        setRunningText(res?.val());
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const renderNews = () => {
    if (news.length > 0) {
      let listNews = news.map((item) => {
        if (item) {
          return (
            <MemoTouchableOpacity
              onPress={() => openNews(item.link)}
              key={item.id}
            >
              <NewsItem
                key={item.id}
                title={item.title}
                body={item.body}
                date={item.date}
                image={item.image}
              />
            </MemoTouchableOpacity>
          );
        }
      });

      return listNews;
    } else {
      return null;
    }
  };

  const renderWeb = () => {
    if (web.length > 0) {
      let listweb = web.map((item) => {
        if (item) {
          return (
            <MemoTouchableOpacity
              onPress={() => openWeb(item.link)}
              key={item.id}
            >
              <WebItem
                key={item.id}
                title={item.title}
                body={item.body}
                date={item.date}
                image={item.image}
              />
            </MemoTouchableOpacity>
          );
        }
      });

      return listweb;
    } else {
      return null;
    }
  };

  const openNews = (url) => {
    Linking.openURL("vnd.youtube://www.youtube.com/watch?v=" + url);
  };
  const openWeb = (url) => {
    Linking.openURL("https://" + url);
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

  const handleBuy = (item) => {
    navigation.navigate("Chatting", {
      data: ourstaffs[0]?.data,
      chatContent: `Saya ingin membeli produk ${item?.title}`,
    });
  };

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <MemoView style={styles.wrapperSection}>
            <Gap height={30} />
            <MemoView style={styles.row}>
              <HomeProfile
                profile={profile}
                onPress={() => navigation.navigate("UserProfile", profile)}
              />

              <View style={styles.rowCenter}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Wishlist", {
                      adminData: ourstaffs[0]?.data,
                    })
                  }
                >
                  <IconFavoriteActive height={32} width={32} />
                </TouchableOpacity>
                <View style={styles.verticalSeparator} />
                <View style={styles.rightContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL("https://wa.me/+62895600394345")
                    }
                  >
                    <Image
                      source={require("../../assets/dummy/dompet.png")}
                      style={{ width: 45, height: 42 }}
                      resizeMode={"contain"}
                    />
                  </TouchableOpacity>

                  <Text style={styles.point}>
                    {CurrencyFormatter(
                      userHomeData !== null ? userHomeData.point : 0
                    )}
                  </Text>
                </View>
              </View>
            </MemoView>

            {banners?.length > 0 ? <BannerSlider data={banners} /> : null}

            <MemoView style={styles.runningTextContainer}>
              <Image
                style={styles.runningTextLogo}
                source={require("../../assets/images/megaphone.png")}
              />
              {runningText ? (
                <View style={{ flex: 1 }}>
                  <TextTicker
                    style={{
                      fontSize: 16,
                      width: Dimensions.get("screen").width - 40,
                    }}
                    duration={10000}
                    loop
                    // bounce
                    repeatSpacer={50}
                  >
                    {runningText}
                  </TextTicker>
                </View>
              ) : null}
            </MemoView>

            <Text style={styles.welcome}>
              Silahkan memilih Staff dan Layanan Kami
            </Text>
          </MemoView>
          <MemoView style={styles.wrapperScroll}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.category}>
                <Gap width={32} />
                {categoryOurstaff.map((item) => {
                  return (
                    <OurStaffCategory
                      key={`category-${item.id}`}
                      category={item.category}
                      onPress={() =>
                        navigation.navigate("ChooseOurStaff", item)
                      }
                    />
                  );
                })}
                <Gap width={22} />
              </View>
            </ScrollView>
          </MemoView>
          <MemoView style={styles.wrapperSection}>
            <Text style={styles.sectionLabel}>Top Our Staff</Text>
            {ourstaffs.map((ourstaff) => {
              return (
                <RatedOurStaff
                  key={ourstaff.id}
                  name={ourstaff.data.fullName}
                  desc={ourstaff.data.profession}
                  avatar={{ uri: ourstaff.data.photo }}
                  onPress={() =>
                    navigation.navigate("OurStaffProfile", ourstaff)
                  }
                />
              );
            })}
            <Text style={styles.sectionLabel}>Video Info and Trending</Text>
          </MemoView>
          {renderNews()}
          <View style={styles.wrapperSection}>
            <Text style={styles.sectionLabel}>Web</Text>
          </View>
          {renderWeb()}
          <Gap height={30} />
          <Text style={styles.transaksi}>Transaksi</Text>
          <Text style={styles.pm}>Pembiayaan Multiguna</Text>
          <View style={styles.garis} />
          <MemoView style={styles.tagihan1}>
            <View style={styles.wrapper1}>
              <Text selectable={true} style={styles.titleTagihan}>
                Tenor : {userHomeData !== null ? userHomeData.tenor1 : 0}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Tagihan :{" "}
                {CurrencyFormatter(
                  userHomeData !== null ? userHomeData.tagihan1 : 0
                )}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Jatuh Tempo : {userHomeData !== null ? userHomeData.tempo1 : 0}
              </Text>
            </View>

            <View style={styles.garis} />
            <View style={styles.wrapper1}>
              <Text selectable={true} style={styles.titleTagihan}>
                Tenor : {userHomeData !== null ? userHomeData.tenor2 : 0}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Tagihan :{" "}
                {CurrencyFormatter(
                  userHomeData !== null ? userHomeData.tagihan2 : 0
                )}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Jatuh Tempo : {userHomeData !== null ? userHomeData.tempo2 : 0}
              </Text>
            </View>

            <View style={styles.garis} />
            <View style={styles.wrapper1}>
              <Text selectable={true} style={styles.titleTagihan}>
                Tenor : {userHomeData !== null ? userHomeData.tenor3 : 0}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Tagihan :{" "}
                {CurrencyFormatter(
                  userHomeData !== null ? userHomeData.tagihan3 : 0
                )}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Jatuh Tempo : {userHomeData !== null ? userHomeData.tempo3 : 0}
              </Text>
            </View>
            <View style={styles.garis} />
          </MemoView>
          <MemoTouchableOpacity
            onPress={() => Linking.openURL("https://wa.me/+62895600394345")}
          >
            <Image
              source={require("../../assets/dummy/pinjam.png")}
              style={{ width: 45, height: 42, marginLeft: 10 }}
              resizeMode={"contain"}
            />
            <Text style={{ marginLeft: 16 }}>Pinjam</Text>
            <Text style={{ marginLeft: 16 }}>
              Klik (sentuh di sini) lanjut ke whatsapp
            </Text>
          </MemoTouchableOpacity>

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
              Produk 2
            </Text>
            <Gap height={16} />
            <TextInput
              onChangeText={(val) => handleFilter(val, "2")}
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
            {searchProduct2Loading ? (
              <ActivityIndicator
                size={40}
                color={colors.primary}
                style={{ marginVertical: 40, marginLeft: 40 }}
              />
            ) : (
              products2?.map((item, index) => (
                <ProductCard
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
              Produk 3
            </Text>
            <Gap height={16} />
            <TextInput
              onChangeText={(val) => handleFilter(val, "3")}
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
            {searchProduct3Loading ? (
              <ActivityIndicator
                size={40}
                color={colors.primary}
                style={{ marginVertical: 40, marginLeft: 40 }}
              />
            ) : (
              products3?.map((item, index) => (
                <ProductCard
                  onPress={() => handleBuy(item)}
                  type="produk3"
                  key={index}
                  item={item}
                />
              ))
            )}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

export default OurStaff;

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
  searchInput: {
    borderWidth: 1,
    marginHorizontal: 12,
    borderRadius: 5,
    borderColor: colors.border,
  },
  runningTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  runningTextLogo: {
    height: 40,
    width: 40,
    marginRight: 8,
  },
  page: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  point: {
    fontSize: 14,
    color: "#E5B654",
    marginTop: 12,
  },
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  wrapperSection: { paddingHorizontal: 16 },
  welcome: {
    fontSize: 18,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginBottom: 16,
    maxWidth: 209,
    fontWeight: "bold",
  },
  category: { flexDirection: "row" },
  wrapperScroll: { marginHorizontal: -16 },
  sectionLabel: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginBottom: 16,
    fontWeight: "bold",
  },
  transaksi: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 4,
    marginBottom: 16,
    paddingLeft: 16,
    fontWeight: "bold",
  },
  transaksi1: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  pm: {
    paddingLeft: 16,
    paddingBottom: 6,
  },
  wrapper1: { flex: 1 },
  titleTagihan: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    maxWidth: "90%",
    paddingLeft: 16,
  },
  garis: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 4,
    paddingTop: 4,
    paddingHorizontal: 16,
  },
  rightContainer: {
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 0.8,
  },
  verticalSeparator: {
    height: 40,
    width: 2,
    marginHorizontal: 8,
    backgroundColor: colors.border,
  },
});
