import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../utils";

const TenorCard = ({ tenor, tagihan, jatuhTempo }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, marginBottom: 8 }}>
        <Text style={styles.text}>Tenor: {tenor}</Text>
        <Text style={styles.text}>Tagihan: {tagihan}</Text>
      </View>
      <Text style={styles.text}>Jatuh Tempo: {jatuhTempo}</Text>
    </View>
  );
};

export default TenorCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    minHeight: 120,
    width: 200,
    borderRadius: 10,
    padding: 14,
  },
  text: {
    color: colors.white,
    marginBottom: 4,
  },
});