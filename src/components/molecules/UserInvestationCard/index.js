import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CurrencyFormatter from "react-native-currency-formatter";
import { Gap } from "../..";
import { ILLogo } from "../../../assets";
import { colors, fonts, getFullDate } from "../../../utils";

const UserInvestationCard = ({ item, type }) => {
  if (type === "member") {
    console.log(item)
    return (
      <View style={styles.container}>
        <View style={styles.userInvestationTitleContainer}>
          <ILLogo height={36} width={36} />
          <Text style={styles.userInvestationTitle}>Member Alo Care</Text>
        </View>
        <Gap height={24} />
        <View style={{ paddingHorizontal: 8 }}>
          <Text>Kode</Text>
          <Text style={styles.nilai}>{item?.code}</Text>
        </View>
        <Gap height={24} />
        <View style={{ paddingHorizontal: 8 }}>
          <Text>Nama Member: {item?.member_name}</Text>
          <Text>Lokasi: {item?.location}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInvestationTitleContainer}>
        <ILLogo height={36} width={36} />
        <Text style={styles.userInvestationTitle}>Alo Care User Investasi</Text>
      </View>
      <Gap height={24} />
      <View style={{ paddingHorizontal: 8 }}>
        <Text>Nilai</Text>
        <Text style={styles.nilai}>
          {CurrencyFormatter(item?.nominal || 0)}
        </Text>
      </View>
      <Gap height={24} />
      <View style={{ paddingHorizontal: 8 }}>
        <Text>Sejak {getFullDate(item?.date)}</Text>
        <Text>{item?.user_id}</Text>
      </View>
    </View>
  );
};

export default UserInvestationCard;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingBottom: 16,
    backgroundColor: colors.white,
    elevation: 4,
    borderRadius: 8,
  },
  userInvestationTitle: {
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    fontWeight: "bold",
  },
  userInvestationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nilai: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
