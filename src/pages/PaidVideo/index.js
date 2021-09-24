import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gap,
  Header,
  Input,
  ModalPassword,
  VideoPlayer,
} from "../../components";
import { Fire } from "../../config";
import { colors } from "../../utils";

const PaidVideo = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [videoLink, setVideoLink] = useState("");
  const [videoModal, setVideoModal] = useState("");
  const [modalPassword, setModalPassword] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Fire.database()
      .ref("video_berbayar")
      .once("value")
      .then((res) => {
        const snapshotVal = res.val();
        const arr = snapshotVal.filter((val) => val);
        setData(arr);
        setAllData(arr);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleFilter = (val) => {
    setLoading(true);
    let arr = [...allData];
    var searchRegex = new RegExp(val, "i");
    arr = arr.filter((item) => searchRegex?.test(item?.title));
    setData(arr);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.pages}>
      <Header onPress={() => navigation.goBack()} title="Video Berbayar" />
      <View style={{ padding: 20, paddingTop: 8 }}>
        <Input
          onChangeText={(val) => handleFilter(val)}
          label="Cari Video"
          placeholder="Masukkan judul"
        />
      </View>
      {loading ? (
        <ActivityIndicator size={24} color={colors.primary} />
      ) : (
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={data}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (item?.password) {
                  setSelectedPassword(item?.password);
                  setSelectedLink(item?.link);
                  setModalPassword(true);
                } else {
                  setVideoLink(item?.link);
                  setVideoModal(true);
                }
              }}
              activeOpacity={0.8}
              style={styles.videoContainer}
            >
              <Image source={{ uri: item?.image }} style={styles.thumbnail} />
              <Gap height={8} />
              <View>
                <Text style={styles.title}>{item?.title}</Text>
                <Gap height={4} />
                <Text
                  numberOfLines={2}
                  lineBreakMode="tail"
                  style={styles.body}
                >
                  {item?.body}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapperStyle}
        />
      )}
      <VideoPlayer
        link={videoLink}
        visible={videoModal}
        onClose={() => setVideoModal(false)}
      />
      <ModalPassword
        type="simple"
        visible={modalPassword}
        onSubmit={(password) => {
          if (password !== selectedPassword) {
            Alert.alert("Password yang ada masukkan salah");
          } else {
            setModalPassword(false);
            setVideoLink(selectedLink);
            setVideoModal(true);
          }
        }}
        onClose={() => {
          setModalPassword(false);
        }}
      />
    </View>
  );
};

export default PaidVideo;

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContentContainer: {
    padding: 20,
    // justifyContent: "space-between",
  },
  columnWrapperStyle: {
    justifyContent: "space-between",
  },
  videoContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    borderRadius: 5,
    width: Dimensions.get("screen").width / 2 - 28,
  },
  thumbnail: {
    height: 140,
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  body: {
    fontSize: 12,
    color: colors.secondary,
  },
});
