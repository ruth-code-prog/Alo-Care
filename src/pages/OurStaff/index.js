import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/core";
import React, { useEffect, useState, useRef, memo, useCallback } from "react";
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
import { IconFavoriteActive, ILLogo, ILNullPhoto } from "../../assets";
import {
  BannerSlider,
  Gap,
  HomeProfile,
  ModalInvestation,
  ModalPassword,
  NewsItem,
  OurStaffCategory,
  ProductCard,
  RatedOurStaff,
  TenorCard,
  UserInvestationCard,
  VideoPlayer,
  WebItem,
} from "../../components";
import { Fire } from "../../config";
import {
  colors,
  filterWishlistProduct,
  fonts,
  getData,
  showError,
  storeData,
  useForm,
  useFormSoul,
} from "../../utils";

const MemoView = memo(View);
const MemoTouchableOpacity = memo(TouchableOpacity);

const OurStaff = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

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
  const [modalInvestation, setModalInvestation] = useState(false);
  const [topInvestor, setTopInvestor] = useState({});
  const [memberData, setMemberData] = useState({});

  const { token } = useSelector((state) => state.fcm);
  const [profile, setProfile] = useState({
    photo: ILNullPhoto,
    fullName: "",
    profession: "",
  });
  const [videoLink, setVideoLink] = useState("");
  const [videoModal, setVideoModal] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);

  const [userWishlist, setUserWishlist] = useFormSoul({
    product1: [],
    product2: [],
    product3: [],
  });

  const pagesScrollRef = useRef(null);

  useEffect(() => {
    getCategoryOurstaff();
    getTopRatedOurstaffs();

    getNews();
    getWeb();

    navigation.addListener("focus", () => {
      getUserData();
    });
  }, [navigation]);

  useEffect(() => {
    getBanners();
    getRunningText();
    getUserList();
    getTopInvestor();
    getMember();
  }, []);

  useFocusEffect(
    useCallback(() => {
      Fire.auth().onAuthStateChanged(async (data) => {
        if (data) {
          getUserHomeData(data.uid);
          getWishlist(data?.uid);
        } else {
          AsyncStorage.clear();
        }
      });
    }, [])
  );

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

  useEffect(() => {
    getProducts();
  }, [userWishlist]);

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
          setAllNews(filterData);
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
              onPress={() => {
                setVideoLink(item?.link);
                setVideoModal(true);
              }}
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

  const handleNewsFilter = (val) => {
    setNewsLoading(true);
    let arr = [...allNews];
    var searchRegex = new RegExp(val, "i");
    arr = arr.filter((item) => searchRegex?.test(item?.title));
    setNews(arr);
    setTimeout(() => {
      setNewsLoading(false);
    }, 1500);
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

  const getTopInvestor = () => {
    Fire.database()
      .ref("user_investasi")
      .limitToFirst(1)
      .once("value")
      .then((res) => {
        let filtered = res?.val().filter((val) => val);
        setTopInvestor(filtered[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              pagesScrollRef?.current?.scrollTo({
                y: 0,
                x: 0,
                animated: true,
              });
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.headerTitle}>ALO CARE</Text>
          </TouchableOpacity>
        </View>
        <ScrollView ref={pagesScrollRef} showsVerticalScrollIndicator={false}>
          <MemoView style={styles.wrapperSection}>
            <Gap height={16} />
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
                      wishlist: userWishlist,
                      uid: userHomeData?.uid,
                    })
                  }
                >
                  <IconFavoriteActive height={32} width={32} />
                </TouchableOpacity>
                <View style={styles.verticalSeparator} />
                <View style={styles.rightContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Chatting", {
                        data: ourstaffs[0]?.data,
                        chatContent: `Saya ingin bertanya mengenai wallet`,
                      });
                    }}
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
          <View>
            <TextInput
              onChangeText={(val) => handleNewsFilter(val)}
              selectTextOnFocus
              style={styles.searchInput}
              placeholder="Cari Info dan Trending"
            />
          </View>
          {newsLoading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size={24} color={colors.primary} />
            </View>
          ) : (
            renderNews()
          )}
          <TouchableOpacity
            onPress={() => setModalPassword(true)}
            style={styles.videoBerbayar}
          >
            <Text
              style={[styles.videoBerbayarTitle, { color: colors.primary }]}
            >
              Lihat Video Berbayar
            </Text>
          </TouchableOpacity>
          <View style={styles.wrapperSection}>
            <Text style={styles.sectionLabel}>Web</Text>
          </View>
          {renderWeb()}
          <Gap height={30} />
          <View style={{ paddingHorizontal: 16 }}>
            <View style={styles.userInvestationTitleContainer}>
              <Text style={styles.userInvestationTitle}>
                Alo Care User Investasi
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("UserInvestation")}
              >
                <Text style={{ color: colors.primary }}>Lihat Semua ></Text>
              </TouchableOpacity>
            </View>
            <Gap height={16} />
            <UserInvestationCard item={topInvestor} />
          </View>
          <Gap height={30} />
          <Text style={styles.transaksi}>Transaksi</Text>
          <Text style={styles.pm}>Pembiayaan Multiguna</Text>
          <View style={styles.garis} />
          <MemoView style={styles.tagihan1}>
            <ScrollView
              contentContainerStyle={{ padding: 20 }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <TenorCard
                tenor={userHomeData?.tenor1 || 0}
                tagihan={CurrencyFormatter(userHomeData?.tagihan1 || 0)}
                jatuhTempo={userHomeData?.tempo1 || 0}
              />
              <View style={{ marginRight: 16 }} />
              <TenorCard
                tenor={userHomeData?.tenor2 || 0}
                tagihan={CurrencyFormatter(userHomeData?.tagihan2 || 0)}
                jatuhTempo={userHomeData?.tempo2 || 0}
              />
              <View style={{ marginRight: 16 }} />
              <TenorCard
                tenor={userHomeData?.tenor3 || 0}
                tagihan={CurrencyFormatter(userHomeData?.tagihan3 || 0)}
                jatuhTempo={userHomeData?.tempo3 || 0}
              />
            </ScrollView>
          </MemoView>
          <MemoTouchableOpacity
            onPress={() => {
              navigation.navigate("Chatting", {
                data: ourstaffs[0]?.data,
                chatContent: `Saya ingin bertanya mengenai peminjaman`,
              });
            }}
          >
            <Image
              source={require("../../assets/dummy/pinjam.png")}
              style={{ width: 45, height: 42, marginLeft: 10 }}
              resizeMode={"contain"}
            />
            <Text style={{ marginLeft: 16 }}>Pinjam</Text>
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
              <Text style={styles.userInvestationTitle}>Member Alocare</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("MemberAlocare")}
              >
                <Text style={{ color: colors.primary }}>Lihat Semua ></Text>
              </TouchableOpacity>
            </View>
            <Gap height={16} />
            <UserInvestationCard type="member" item={memberData} />
          </View>
        </ScrollView>
      </View>
      <VideoPlayer
        link={videoLink}
        visible={videoModal}
        onClose={() => setVideoModal(false)}
      />
      <ModalInvestation
        visible={modalInvestation}
        onClose={() => setModalInvestation(false)}
      />
      <ModalPassword
        visible={modalPassword}
        onSubmit={() => {
          setModalPassword(false);
          navigation.navigate("PaidVideo");
        }}
        onClose={() => {
          setModalPassword(false);
        }}
      />
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
  videoBerbayar: {
    height: 40,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.border,
  },
  videoBerbayarTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchInput: {
    borderWidth: 1,
    marginHorizontal: 16,
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
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    backgroundColor: colors.secondary,
  },
  headerTitle: {
    fontSize: 24,
    color: colors.primary,
    fontFamily: fonts.primary[900],
    fontWeight: "bold",
    letterSpacing: 2,
  },
});
