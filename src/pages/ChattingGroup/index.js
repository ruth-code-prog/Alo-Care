import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Header, ChatItem, InputChat } from "../../components";
import {
  fonts,
  colors,
  getData,
  showError,
  getChatTime,
  setDateChat,
} from "../../utils";
import { Fire } from "../../config";

const ChattingGroup = ({ navigation, route }) => {
  const scrollRef = useRef(null);
  const [chatContent, setChatContent] = useState("");
  const [user, setUser] = useState({});
  const [chatData, setChatData] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (user.uid !== undefined) {
      const urlFirebase = `chatting_group/`;
      Fire.database()
        .ref(urlFirebase)
        .on("value", (snapshot) => {
          if (snapshot.val()) {
            const dataSnapshot = snapshot.val();

            let realData = {};
            const allDataChat = [];
            Object.entries(dataSnapshot)
              .reverse()
              .map((val) => {
                realData[val[0]] = val[1];
              });
            Object.keys(realData).map((key) => {
              const dataChat = realData[key];
              let valueDataChat = Object.values(dataChat);
              valueDataChat = valueDataChat.sort((a, b) => {
                return b.chatDate - a.chatDate;
              });
              valueDataChat.reverse();
              allDataChat.push({
                id: key,
                data: valueDataChat,
              });
            });
            setChatData(allDataChat);
            getData("userList").then((res) => {
              if (res) {
                setUserList(res);
              }
            });
          }
        });
    }
  }, [user]);

  useEffect(() => {
    getDataUserFromLocal();
  }, []);

  useEffect(() => {
    if (photo) {
      chatSend("photo");
    }
  }, [photo]);

  const getDataUserFromLocal = () => {
    getData("user").then((res) => {
      setUser(res);
    });
  };

  const sendNotification = (message, title) => {
    let dataUser = user;
    delete dataUser.photo;
    let currentStaff = {
      data: dataUser,
    };
    var datas = JSON.stringify({
      registration_ids: [user?.token],
      notification: {
        body: message,
        title: title,
        priority: "high",
      },
      data: {
        body: message,
        title: title,
        message: message,
        priority: "high",
        moreData: currentStaff,
      },
      soundname: "default",
      priority: "high",
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
        console.log("success", xhr.responseText);
      } else {
        console.warn("error");
      }
    };

    // xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
    // xhr.setRequestHeader("content-type", "application/json");
    // xhr.setRequestHeader(
    //   "authorization",
    //   "key=AAAAmCard3M:APA91bGCNpwLLKIVj-I6rC9KBbPwHuKlYwEDB1Mvf0bs3D15IpKnk32bSLWXwQcd2u8e_k0tepl9NbyjmURYwNfrUdggbdi3nX1bJz-hOpQ20XdUwsKQbROZZOi9txHEdANq_tJJg-uJ"
    // );
    // xhr.setRequestHeader("cache-control", "no-cache");
    // xhr.setRequestHeader(
    //   "postman-token",
    //   "5ba4747d-01b4-80e6-1ce5-e43f0c3b4a42"
    // );

    // xhr.send(datas);
  };

  const chatSend = (type) => {
    const today = new Date();

    const data = {
      sendBy: user.uid,
      chatDate: today.getTime(),
      chatTime: getChatTime(today),
      chatContent: type === "photo" ? photo : chatContent,
      type: type ? type : null,
      fullName: user?.fullName,
    };

    const urlFirebase = `chatting_group/${setDateChat(today)}`;

    Fire.database()
      .ref(urlFirebase)
      .push(data)
      .then(() => {
        setChatContent("");
        setPhoto(null);
      })
      .catch((err) => {
        showError(err.message);
        setPhoto(null);
      });
    sendNotification(chatContent, "Notifikasi Pesan");
  };

  const getImage = () => {
    launchImageLibrary({ quality: 0.5, includeBase64: true }, (response) => {
      if (response.didCancel || response.error) {
        showError("oops, sepertinya anda tidak memilih foto nya?");
      } else {
        const source = { uri: response.uri };
        setPhoto(`data:${response?.type};base64, ${response?.base64}`);
      }
    });
  };

  return (
    <View style={styles.page}>
      <Header
        type="dark-profile"
        title={"Komunitas Alocare"}
        desc={"Alocare"}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current.scrollToEnd()}
        >
          {chatData.map((chat) => {
            return (
              <View key={chat?.id}>
                <Text style={styles.chatDate}>{chat?.id}</Text>
                {chat.data.map((itemChat) => {
                  const isMe = itemChat?.sendBy === user?.uid;
                  const photoLink = userList?.filter(
                    (val) => val?.data?.uid === itemChat?.sendBy
                  );
                  return (
                    <ChatItem
                      fullName={itemChat?.fullName}
                      key={itemChat?.chatTime}
                      isMe={isMe}
                      text={itemChat?.chatContent}
                      date={itemChat?.chatTime}
                      type={itemChat?.type}
                      photo={
                        isMe
                          ? null
                          : {
                              uri: photoLink[0]?.data?.photo,
                            }
                      }
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
        onUploadPress={getImage}
        onChangeText={(value) => setChatContent(value)}
        onButtonPress={() => chatSend()}
        type="group"
      />
    </View>
  );
};

export default ChattingGroup;

const styles = StyleSheet.create({
  page: { backgroundColor: colors.white, flex: 1 },
  content: { flex: 1 },
  chatDate: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginVertical: 20,
    textAlign: "center",
  },
});
