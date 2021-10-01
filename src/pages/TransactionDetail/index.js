import { useRoute } from "@react-navigation/core";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyFormatter from "react-native-currency-formatter";
import { Gap, ProductTransaction } from "../../components";
import { colors, getFullDate } from "../../utils";

const TransactionDetail = () => {
  const { item } = useRoute().params || {};

  return (
    <View style={styles.pages}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.sectionTitle}>List Item</Text>
          {item?.produk?.map((val, index) => (
            <View>
              <ProductTransaction item={val} />
              <Gap height={8} />
            </View>
          ))}
        </View>
        <Gap height={8} />
        <Text style={{ fontSize: 16 }}>
          Sub Total:{" "}
          <Text style={{ color: colors.primary, fontWeight: "bold" }}>
            {CurrencyFormatter(item?.sub_total)}
          </Text>
        </Text>
        <Gap height={24} />
        <View>
          <Text style={styles.sectionTitle}>Riwayat Pengiriman</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Text>
              No Resi:{" "}
              <Text style={{ color: colors.primary }}>{item?.resi}</Text>
            </Text>
            <Gap width={8} />
            {/* <TouchableOpacity>
            <Text style={{ color: colors.primary, fontWeight: "bold" }}>
              SALIN
            </Text>
          </TouchableOpacity> */}
          </View>
          <Gap height={24} />
          <FlatList
            keyExtractor={(_, index) => index.toString()}
            data={item?.sent_history}
            renderItem={({ item: listItem, index }) => (
              <View>
                <View style={[{ flexDirection: "row" }, styles.container]}>
                  <View style={styles.leftContainer}>
                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: 12,
                        color: index ? "grey" : colors.text.primary,
                      }}
                    >
                      {/* {index === 0
                      ? `Hari ini ${getTime(item?.status_date)}`
                      : `${getFullDate(item?.status_date)}`} */}
                      {getFullDate(listItem?.date)}
                    </Text>
                  </View>
                  <View style={[styles.midContainer]}>
                    {index === 5 - 1 ? null : <View style={styles.line} />}
                    <View
                      style={
                        index === 0
                          ? styles.dotStyleActive
                          : styles.dotStyleNotActive
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.rightContainer,
                      { color: index ? "grey" : colors.primary },
                    ]}
                  >
                    {listItem?.desc}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TransactionDetail;

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  container: {
    minHeight: 60,
  },
  leftContainer: {
    flex: 1,
    marginTop: -2,
  },
  line: {
    backgroundColor: colors.border,
    height: "100%",
    position: "absolute",
    width: 1,
  },
  midContainer: {
    flex: 0.7,
    alignItems: "center",
  },
  rightContainer: {
    flex: 4,
    marginTop: -2,
    fontSize: 16,
  },
  dotStyleNotActive: {
    height: 8,
    width: 8,
    backgroundColor: colors.border,
    borderRadius: 200,
  },
  dotStyleActive: {
    height: 6,
    width: 6,
    backgroundColor: colors.primary,
    borderRadius: 200,
  },
});