import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Gap, TransactionItem } from "../..";
import { colors } from "../../../utils";

const TransactionList = ({ data }) => {
  return (
    <FlatList
      contentContainerStyle={{ padding: 20 }}
      keyExtractor={(_, index) => index.toString()}
      data={data}
      renderItem={({ item }) => <TransactionItem item={item} />}
      ItemSeparatorComponent={() => <Gap height={16} />}
      ListEmptyComponent={() => (
        <View style={{ margin: 40, alignItems: "center" }}>
          <Text style={{ fontSize: 20, color: colors.secondary }}>
            Belum ada transaksi
          </Text>
        </View>
      )}
    />
  );
};

export default TransactionList;

const styles = StyleSheet.create({});
