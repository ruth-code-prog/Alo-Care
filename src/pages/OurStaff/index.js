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
  ModalPoint,
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

const CATEGORY_DATA = [
  {
    title: "Finance",
    image: require("../../assets/images/finance.png"),
    page: "FinancePage",
  },
  {
    title: "Video Edukasi & Meeting Room",
    image: require("../../assets/images/video.png"),
    page: "VideoPage",
  },
  {
    title: "Product",
    image: require("../../assets/images/product.png"),
    page: "ProductPage",
  },
  {
    title: "Website",
    image: require("../../assets/images/website.png"),
    page: "WebsitePage",
  },
];

const OurStaff = ({ navigation }) => {
  const [categoryOurstaff, setCategoryOurstaff] = useState([]);
  const [ourstaffs, setOurstaffs] = useState([]);

  const [userHomeData, setUserHomeData] = useState({});
  const [modalPointVisible, setModalPointVisible] = useState(true);

  const [banners, setBanners] = useState([]);
  const [runningText, setRunningText] = useState(null);
  const [modalInvestation, setModalInvestation] = useState(false);

  const { token } = useSelector((state) => state.fcm);
  const [profile, setProfile] = useState({
    photo: ILNullPhoto,
    fullName: "",
    profession: "",
  });

  const [pointImage, setPointImage] = useState("");

  const [userWishlist, setUserWishlist] = useFormSoul({
    product1: [],
    product2: [],
    product3: [],
  });

  const pagesScrollRef = useRef(null);

  useEffect(() => {
    getCategoryOurstaff();
    getTopRatedOurstaffs();

    navigation.addListener("focus", () => {
      getUserData();
    });
  }, [navigation]);

  useEffect(() => {
    getBanners();
    getRunningText();
    getUserList();
    getPointImage();
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

  const getPointImage = () => {
    Fire.database()
      .ref("point_popup_image")
      .once("value")
      .then((res) => {
        console.log("poinntt", res.val());
        setPointImage(res.val());
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
                        chatContent: `Saya ingin menambah deposite E-wallet`,
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
                    duration={30000}
                    loop
                    // bounce
                    repeatSpacer={50}
                  >
                    {runningText}
                  </TextTicker>
                </View>
              ) : null}
            </MemoView>

            <Text style={styles.welcome}>Chat Staff dan Layanan Kami</Text>
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
            <Text style={styles.sectionLabel}>Fitur Alo Care</Text>
            <MemoView style={styles.categoryContainer}>
              {CATEGORY_DATA.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(
                      item?.page,
                      item.page === "ProductPage"
                        ? { userHomeData, ourstaffs }
                        : {}
                    );
                  }}
                  style={styles.categoryItem}
                  key={index}
                >
                  <Image
                    style={styles.imageCategory}
                    source={
                      item?.image || require("../../assets/images/finance.png")
                    }
                  />
                  <Text style={styles.titleCategory}>{item?.title}</Text>
                </TouchableOpacity>
              ))}
            </MemoView>
          </MemoView>

          <Gap height={30} />
        </ScrollView>
      </View>

      <ModalInvestation
        visible={modalInvestation}
        onClose={() => setModalInvestation(false)}
      />

      <ModalPoint
        image={pointImage}
        point={userHomeData?.point_user}
        visible={modalPointVisible}
        onClose={() => setModalPointVisible(false)}
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
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryItem: {
    flexBasis: "50%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  imageCategory: {
    width: 120,
    height: 120,
  },
  titleCategory: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
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
