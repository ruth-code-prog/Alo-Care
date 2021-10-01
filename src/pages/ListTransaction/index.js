import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TransactionList } from "../../components";
import { Fire } from "../../config";
import { colors, getData } from "../../utils";

const ListTransaction = () => {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    getDataUserFromLocal();
  }, []);

  useEffect(() => {
    if (user.uid !== undefined) {
      getList();
    }
  }, [user]);

  const getDataUserFromLocal = () => {
    getData("user").then((res) => {
      setUser(res);
    });
  };

  const getList = () => {
    Fire.database()
      .ref(`transaction/${user?.uid}/`)
      .on("value", (snapshot) => {
        const dataSnapshot = snapshot.val();
        const realData = [];
        if (dataSnapshot) {
          Object.entries(dataSnapshot).map((val) => {
            realData?.push(val[1]);
          });
          setData(realData);
        }
      });
  };

  return (
    <View style={styles.pages}>
      <View style={styles.content}>
        <TransactionList data={data} />
      </View>
    </View>
  );
};

export default ListTransaction;

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});