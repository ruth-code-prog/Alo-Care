import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

const Dompet = () => {
  return (
    <>
      <Image
        source={require("../../assets/dummy/dompet.png")}
        style={{
          paddingTop: 90,
          width: 45,
          height: 42,
          marginLeft: 300,
          position: "absolute",
          justifyContent: "space-between",
        }}
        resizeMode={"contain"}
      />
      <Text onPress={() => Linking.openURL("https://wa.me/+62895600394345")}
      style={{
        paddingTop: 30,
        fontWeight: 'bold',
        marginLeft: 196,
        position: "absolute",
        justifyContent: "space-between",
      }}>+ Deposit</Text>
    </>
  );
};

export default Dompet;

const styles = StyleSheet.create({});
