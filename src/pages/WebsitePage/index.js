import { useNavigation } from "@react-navigation/core";
import React, { memo, useEffect, useState } from "react";
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, WebItem } from "../../components";
import { Fire } from "../../config";
import { colors, fonts, showError } from "../../utils";

const MemoTouchableOpacity = memo(TouchableOpacity);

const WebsitePage = () => {
  const [web, setWeb] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    getWeb();
  }, []);

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

  const openWeb = (url) => {
    Linking.openURL("https://" + url);
  };

  const renderWeb = () => {
    if (web.length > 0) {
      let listweb = web.map((item, index) => {
        if (item) {
          return (
            <MemoTouchableOpacity
              onPress={() => openWeb(item.link)}
              key={index}
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

  return (
    <SafeAreaView style={styles.pages}>
      <Header onPress={() => navigation.goBack()} title="Website" />
      <View style={styles.wrapperSection}>
        <Text style={styles.sectionLabel}>Web</Text>
      </View>
      {renderWeb()}
    </SafeAreaView>
  );
};

export default WebsitePage;

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapperSection: { paddingHorizontal: 16 },
  sectionLabel: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginBottom: 16,
    fontWeight: "bold",
  },
});
