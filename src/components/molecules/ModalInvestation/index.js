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
import { UserInvestationCard } from "..";
import { Gap } from "../..";
import { Fire } from "../../../config";
import { colors } from "../../../utils";

const ModalInvestation = ({ visible, onClose }) => {
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
    <Modal animationType="fade" visible={visible} transparent>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => onClose && onClose()}
          style={styles.closeIcon}
        >
          <Text style={{ color: colors.white, fontSize: 20 }}>X</Text>
        </TouchableOpacity>
        <View style={styles.contentContainer}>
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
      </View>
    </Modal>
  );
};

export default ModalInvestation;

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
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    justifyContent: "center",
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
