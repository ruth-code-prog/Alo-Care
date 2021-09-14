import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Gap, TransactionItem } from "../..";

const TransactionList = ({data}) => {
  return (
    <FlatList
      contentContainerStyle={{ padding: 20 }}
      keyExtractor={(_, index) => index.toString()}
      data={data}
      renderItem={({item}) => <TransactionItem item={item} />}
      ItemSeparatorComponent={() => <Gap height={16} />}
    />
  );
};

export default TransactionList;

const styles = StyleSheet.create({});
