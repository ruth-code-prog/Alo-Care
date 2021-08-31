import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyFormatter from "react-native-currency-formatter";
import TextTicker from "react-native-text-ticker";
import { useSelector } from "react-redux";
import { ILNullPhoto } from "../../assets";
import {
  BannerSlider,
  Gap,
  HomeProfile,
  NewsItem,
  OurStaffCategory,
  RatedOurStaff,
  WebItem,
} from "../../components";
import { Fire } from "../../config";
import { colors, fonts, getData, showError, storeData } from "../../utils";

const OurStaff = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [web, setWeb] = useState([]);
  const [categoryOurstaff, setCategoryOurstaff] = useState([]);
  const [ourstaffs, setOurstaffs] = useState([]);
  const [userPoint, setUserPoint] = useState(null);
  const [userTenor1, setUserTenor1] = useState(null);
  const [userTagihan1, setUserTagihan1] = useState(null);
  const [userTempo1, setUserTempo1] = useState(null);
  const [userTenor2, setUserTenor2] = useState(null);
  const [userTagihan2, setUserTagihan2] = useState(null);
  const [userTempo2, setUserTempo2] = useState(null);
  const [userTenor3, setUserTenor3] = useState(null);
  const [userTagihan3, setUserTagihan3] = useState(null);
  const [userTempo3, setUserTempo3] = useState(null);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [runningText, setRunningText] = useState(null);

  const runningTextRef = useRef(null);

  const { token } = useSelector((state) => state.fcm);
  const [profile, setProfile] = useState({
    photo: ILNullPhoto,
    fullName: "",
    profession: "",
  });
  const shadowOpt = {
    width: 160,
    height: 170,
    color: "#000",
    border: 2,
    radius: 3,
    opacity: 0.2,
    x: 0,
    y: 3,
    style: { marginVertical: 5 },
  };
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
    Fire.auth().onAuthStateChanged(async (data) => {
      if (data) {
        getUserPoint(data.uid);
        getUserTenor1(data.uid);
        getUserTagihan1(data.uid);
        getUserTempo1(data.uid);
        getUserTenor2(data.uid);
        getUserTagihan2(data.uid);
        getUserTempo2(data.uid);
        getUserTenor3(data.uid);
        getUserTagihan3(data.uid);
        getUserTempo3(data.uid);
      }
    });
    getBanners();
    getProducts();
    getRunningText();
  }, []);

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

  const getUserPoint = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserPoint(snapshot.val());
        }
      });
  };

  const getUserTenor1 = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserTenor1(snapshot.val());
        }
      });
  };

  const getUserTagihan1 = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserTagihan1(snapshot.val());
        }
      });
  };

  const getUserTempo1 = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserTempo1(snapshot.val());
        }
      });
  };

  const getUserTenor2 = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserTenor2(snapshot.val());
        }
      });
  };

  const getUserTagihan2 = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserTagihan2(snapshot.val());
        }
      });
  };

  const getUserTempo2 = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserTempo2(snapshot.val());
        }
      });
  };

  const getUserTenor3 = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserTenor3(snapshot.val());
        }
      });
  };

  const getUserTagihan3 = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserTagihan3(snapshot.val());
        }
      });
  };

  const getUserTempo3 = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserTempo3(snapshot.val());
        }
      });
  };

  const getProducts = () => {
    Fire.database()
      .ref("produk")
      .once("value")
      .then((res) => {
        const arr = [...res.val()];
        setProducts(arr.filter((val) => val !== null));
      })
      .catch((err) => {
        console.error(err);
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

  const renderNews = () => {
    if (news.length > 0) {
      let listNews = news.map((item) => {
        if (item) {
          return (
            <TouchableOpacity onPress={() => openNews(item.link)} key={item.id}>
              <NewsItem
                key={item.id}
                title={item.title}
                body={item.body}
                date={item.date}
                image={item.image}
              />
            </TouchableOpacity>
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
            <TouchableOpacity onPress={() => openWeb(item.link)} key={item.id}>
              <WebItem
                key={item.id}
                title={item.title}
                body={item.body}
                date={item.date}
                image={item.image}
              />
            </TouchableOpacity>
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

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.wrapperSection}>
            <Gap height={30} />
            <View style={styles.row}>
              <HomeProfile
                profile={profile}
                onPress={() => navigation.navigate("UserProfile", profile)}
              />

              <TouchableOpacity
                onPress={() => Linking.openURL("https://wa.me/+62895600394345")}
              >
                <Image
                  source={require("../../assets/dummy/dompet.png")}
                  style={{ width: 45, height: 42, marginLeft: 150 }}
                  resizeMode={"contain"}
                />
              </TouchableOpacity>

              <Text style={styles.point}>
                {CurrencyFormatter(userPoint !== null ? userPoint.point : 0)}
              </Text>
            </View>

            {banners?.length > 0 ? <BannerSlider data={banners} /> : null}

            <View style={styles.runningTextContainer}>
              <Image
                style={styles.runningTextLogo}
                source={require("../../assets/images/megaphone.png")}
              />
              {runningText ? (
                <View style={{flex: 1}}>
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
            </View>

            <Text style={styles.welcome}>
              Silahkan memilih Staff dan Layanan Kami
            </Text>
          </View>
          <View style={styles.wrapperScroll}>
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
          </View>
          <View style={styles.wrapperSection}>
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
          </View>
          {renderNews()}
          <View style={styles.wrapperSection}>
            <Text style={styles.sectionLabel}>Web</Text>
          </View>
          {renderWeb()}
          <Gap height={30} />
          <Text style={styles.transaksi}>Transaksi</Text>
          <Text style={styles.pm}>Pembiayaan Multiguna</Text>
          <View style={styles.garis} />
          <View style={styles.tagihan1}>
            <View style={styles.wrapper1}>
              <Text selectable={true} style={styles.titleTagihan}>
                Tenor : {userTenor1 !== null ? userTenor1.tenor1 : 0}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Tagihan :{" "}
                {CurrencyFormatter(
                  userTagihan1 !== null ? userTagihan1.tagihan1 : 0
                )}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Jatuh Tempo : {userTempo1 !== null ? userTempo1.tempo1 : 0}
              </Text>
            </View>

            <View style={styles.garis} />
            <View style={styles.wrapper1}>
              <Text selectable={true} style={styles.titleTagihan}>
                Tenor : {userTenor2 !== null ? userTenor2.tenor2 : 0}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Tagihan :{" "}
                {CurrencyFormatter(
                  userTagihan2 !== null ? userTagihan2.tagihan2 : 0
                )}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Jatuh Tempo : {userTempo2 !== null ? userTempo2.tempo2 : 0}
              </Text>
            </View>

            <View style={styles.garis} />
            <View style={styles.wrapper1}>
              <Text selectable={true} style={styles.titleTagihan}>
                Tenor : {userTenor3 !== null ? userTenor3.tenor3 : 0}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Tagihan :{" "}
                {CurrencyFormatter(
                  userTagihan3 !== null ? userTagihan3.tagihan3 : 0
                )}
              </Text>
              <Text selectable={true} style={styles.titleTagihan}>
                Jatuh Tempo : {userTempo3 !== null ? userTempo3.tempo3 : 0}
              </Text>
            </View>
            <View style={styles.garis} />
          </View>
          <TouchableOpacity
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
          </TouchableOpacity>

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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10, paddingHorizontal: 10 }}
          >
            {products?.map((item, index) => (
              <View
                key={index}
                style={[
                  {
                    width: 300,
                    borderRadius: 10,
                    marginRight: 10,
                    marginBottom: 24,
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
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "300",
                      color: "#636e72",
                    }}
                  >
                    {item?.lokasi}
                  </Text>
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
                </View>
              </View>
            ))}
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
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    paddingTop: 12,
    marginLeft: 180,
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
});
