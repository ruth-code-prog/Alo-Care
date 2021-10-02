import { useNavigation } from "@react-navigation/core";
import React, { memo, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyFormatter from "react-native-currency-formatter";
import { Gap, Header, TenorCard, UserInvestationCard } from "../../components";
import { Fire } from "../../config";
import { colors, fonts, showError } from "../../utils";

const MemoView = memo(View);
const MemoTouchableOpacity = memo(TouchableOpacity);

const FinancePage = () => {
  const [topInvestor, setTopInvestor] = useState([]);
  const [userHomeData, setUserHomeData] = useState([]);
  const [ourstaffs, setOurstaffs] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    getTopInvestor();
    getUserHomeData();
    getTopRatedOurstaffs();
  }, []);

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

  const getUserHomeData = (uid) => {
    Fire.database()
      .ref("users/" + uid)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          setUserHomeData(snapshot.val());
        }
      });
  };

  const getTopRatedOurstaffs = () => {
    Fire.database()
      .ref("ourstaffs/")
      .orderByChild("rate")
      .limitToLast(1)
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

  return (
    <SafeAreaView style={styles.pages}>
      <Header onPress={() => navigation.goBack()} title="Finance" />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.userInvestationTitleContainer}>
          <Text style={styles.userInvestationTitle}>
            Alo Care User Investasi
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("UserInvestation")}
          >
            <Text style={{ color: colors.primary }}>Lihat Semua </Text>
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
            chatContent: `Saya ingin mengajukan Pinjaman`,
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
    </SafeAreaView>
  );
};

export default FinancePage;

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    backgroundColor: colors.white,
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
  pm: {
    paddingLeft: 16,
    paddingBottom: 6,
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
