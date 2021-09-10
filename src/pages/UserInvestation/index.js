import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Gap, UserInvestationCard } from "../../components";
import { Fire } from "../../config";
import { colors } from "../../utils";

const UserInvestation = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const handleFilter = (val) => {
    setLoading(true);
    let arr = [...allData];
    var searchRegex = new RegExp(val, "i");
    arr = arr.filter((item) => searchRegex?.test(item?.user_id));
    setData(arr);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const getData = () => {
    Fire.database()
      .ref("user_investasi")
      .once("value")
      .then((res) => {
        let filtered = res?.val().filter((val) => val);
        setData(filtered);
        setAllData(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput
          onChangeText={(val) => handleFilter(val)}
          selectTextOnFocus
          style={styles.searchInput}
          placeholder="Cari Investor"
        />
        <Gap height={8} />
      </View>

      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Gap height={16} />}
        keyExtractor={(_, index) => index.toString()}
        data={data}
        renderItem={({ item }) => {
          if (loading) {
            return <ActivityIndicator size={32} color={colors.primary} />;
          } else {
            return <UserInvestationCard item={item} />;
          }
        }}
      />
    </View>
  );
};

export default UserInvestation;

const styles = StyleSheet.create({
  closeIcon: {
    marginBottom: 8,
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 40
  },
  contentContainer: {
    backgroundColor: colors.white,
    paddingTop: 16,
    borderRadius: 5,
    maxHeight: Dimensions.get("screen").height - 300,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.border,
  },
});
