import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {List} from '../../components';
import {Fire} from '../../config';
import {colors, fonts, getData} from '../../utils';

const Messages = ({navigation}) => {
  const [user, setUser] = useState({});
  const [historyChat, setHistoryChat] = useState([]);

  useEffect(() => {
    getDataUserFromLocal();
    const rootDB = Fire.database().ref();
    const urlHistory = `messages/${user.uid}/`;
    const messagesDB = rootDB.child(urlHistory);

    messagesDB.on('value', async snapshot => {
      if (snapshot.val()) {
        const oldData = snapshot.val();
        const data = [];

        const promises = await Object.keys(oldData).map(async key => {
          const urlUidOurstaff = `ourstaffs/${oldData[key].uidPartner}`;
          const detailOurstaff = await rootDB.child(urlUidOurstaff).once('value');
          data.push({
            id: key,
            detailOurstaff: detailOurstaff.val(),
            ...oldData[key],
          });
        });

        await Promise.all(promises);

        setHistoryChat(data);
      }
    });
  }, [user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>Pesan</Text>
        {historyChat.map(chat => {
          const dataOurstaff = {
            id: chat.detailOurstaff.uid,
            data: chat.detailOurstaff,
          };
          return (
            <List
              key={chat.id}
              profile={{uri: chat.detailOurstaff.photo}}
              name={chat.detailOurstaff.fullName}
              desc={chat.lastContentChat}
              onPress={() => navigation.navigate('Chatting', dataOurstaff)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.secondary, flex: 1},
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginLeft: 16,
  },
});
