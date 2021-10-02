import { useNavigation } from "@react-navigation/core";
import React, { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, ModalPassword, NewsItem, VideoPlayer } from "../../components";
import { Fire } from "../../config";
import { colors, fonts, showError } from "../../utils";

const MemoTouchableOpacity = memo(TouchableOpacity);

const VideoPage = () => {
  const [news, setNews] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [videoModal, setVideoModal] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    getNews();
  }, []);

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

  return (
    <SafeAreaView style={styles.pages}>
      <Header onPress={() => navigation.goBack()} title="Video" />
      <Text style={styles.sectionLabel}>Video Trending</Text>
      <View>
        <TextInput
          onChangeText={(val) => handleNewsFilter(val)}
          selectTextOnFocus
          style={styles.searchInput}
          placeholder="Cari Video Trending"
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
        <Text style={[styles.videoBerbayarTitle, { color: colors.primary }]}>
          Lihat Video Berbayar
        </Text>
      </TouchableOpacity>
      <VideoPlayer
        link={videoLink}
        visible={videoModal}
        onClose={() => setVideoModal(false)}
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
    </SafeAreaView>
  );
};

export default VideoPage;

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginVertical: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  searchInput: {
    borderWidth: 1,
    marginHorizontal: 16,
    borderRadius: 5,
    borderColor: colors.border,
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
});
