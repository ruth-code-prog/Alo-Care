import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Header, ChatItem, InputChat } from '../../components';
import { localNotificationService } from '../../fcm/LocalNotificationService';
import {
  fonts,
  colors,
  getData,
  showError,
  getChatTime,
  setDateChat,
  storeData,
} from '../../utils';
import { Fire } from '../../config';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import Moment from 'moment';
import moment from 'moment';


const Chatting = ({ navigation, route }) => {
  const dataOurstaff = route.params;
  const scrollRef = useRef(null);
  const [chatContent, setChatContent] = useState('');
  const [user, setUser] = useState({});
  const [chatData, setChatData] = useState([]);
  
  useEffect(() => {
    if (user.uid !== undefined) {
      const chatID = `${user.uid}_${dataOurstaff.data.uid}`;
      const urlFirebase = `chatting/${chatID}/allChat/`;
      Fire.database()
        .ref(urlFirebase).orderByValue()
        .on('value', snapshot => {
          if (snapshot.val()) {
            const data = snapshot.val();
            let keys = Object.keys(data);
            var result = keys.map((key) => {
              let tanggal = key.split("-");
              let bulan = tanggal[1].length == 1 ? `0${tanggal[1]}` : tanggal[1];
              tanggal = `${tanggal[0]}-${bulan}-${tanggal[2]}`;
              return { id: tanggal, data: Object.values(data[key]).reverse() }
            }
            );
            result.reverse();
            setChatData(result);
          }
        });
    }

  }, [user]);

  useEffect(() => {
    getDataUserFromLocal();
  },[])
  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };


  const sendNotification = (message, title) => {
    let dataUser = user
    delete dataUser.photo;
    delete dataUser.photoDB;
    let currentStaff = {
      data: dataUser
    }
    var datas = JSON.stringify({
      "registration_ids": [
        dataOurstaff.data.token
      ],
      "notification": {
        "body": message,
        "title": title,
        "priority": "high"
      },
      "data": {
        "body": message,
        "title": title,
        "message": message,
        "priority": "high",
        "moreData": currentStaff
      },
      "soundname": "default",
      "priority": "high"
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        console.log('success', xhr.responseText);
      } else {
        console.warn('error');
      }
    };

    xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("authorization", "key=AAAAmCard3M:APA91bGCNpwLLKIVj-I6rC9KBbPwHuKlYwEDB1Mvf0bs3D15IpKnk32bSLWXwQcd2u8e_k0tepl9NbyjmURYwNfrUdggbdi3nX1bJz-hOpQ20XdUwsKQbROZZOi9txHEdANq_tJJg-uJ");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "5ba4747d-01b4-80e6-1ce5-e43f0c3b4a42");

    xhr.send(datas);
  }

  const chatSend = () => {
    const today = new Date();
    const chatDate = moment().format('YYYY-MM-DD');
    const chatTime = moment().format("HH:MM");
    const data = {
      sendBy: user.uid,
      chatDate: chatDate,
      chatTime: chatTime,
      chatContent: chatContent,
    };

    const chatID = `${user.uid}_${dataOurstaff.data.uid}`;

    const urlFirebase = `chatting/${chatID}/allChat/${setDateChat(today)}`;
    const urlMessageUser = `messages/${user.uid}/${chatID}`;
    const urlMessageOurstaff = `messages/${dataOurstaff.data.uid}/${chatID}`;
    const dataHistoryChatForUser = {
      lastContentChat: chatContent,
      lastChatDate: chatDate,
      uidPartner: dataOurstaff.data.uid,
    };
    const dataHistoryChatForOurstaff = {
      lastContentChat: chatContent,
      lastChatDate: chatTime,
      uidPartner: user.uid,
    };
    Fire.database()
      .ref(urlFirebase)
      .push(data)
      .then(() => {
        setChatContent('');
        // set history for user
        Fire.database()
          .ref(urlMessageUser)
          .set(dataHistoryChatForUser);

        // set history for dataDoctor
        Fire.database()
          .ref(urlMessageOurstaff)
          .set(dataHistoryChatForOurstaff);
      })
      .catch(err => {
        showError(err.message);
      });
    sendNotification(chatContent, "Notifikasi Pesan");
  };
  return (
    <View style={styles.page}>
      <Header
        type="dark-profile"
        title={dataOurstaff.data.fullName}
        desc={dataOurstaff.data.category}
        photo={{ uri: dataOurstaff.data.photo }}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current.scrollToEnd()}>
          {chatData.map(chat => {
            return (
              <View key={chat.id}>
                <Text style={styles.chatDate}>{chat.id}</Text>
                {chat.data.map(itemChat => {
                  const isMe = itemChat.sendBy === user.uid;
                  return (
                    <ChatItem
                      key={itemChat.chatDate}
                      isMe={isMe}
                      text={itemChat.chatContent}
                      date={itemChat.chatTime}
                      photo={isMe ? null : { uri: dataOurstaff.data.photo }}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
      <InputChat
        value={chatContent}
        onChangeText={value => setChatContent(value)}
        onButtonPress={chatSend}
        targetChat={dataOurstaff}
      />
    </View>
  );
};

export default Chatting;

const styles = StyleSheet.create({
  page: { backgroundColor: colors.white, flex: 1 },
  content: { flex: 1 },
  chatDate: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginVertical: 20,
    textAlign: 'center',
  },
});
