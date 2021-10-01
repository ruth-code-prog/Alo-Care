import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Button, Gap } from "..";
import { ChatItem, InputChat } from "../..";
import { Fire } from "../../../config";
import {
  colors,
  fonts,
  getChatTime,
  getData,
  responsiveHeight,
  setDateChat,
  showError,
} from "../../../utils";

const VideoPlayer = ({ link, visible, onClose, withChat }) => {
  const scrollRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [user, setUser] = useState({});
  const [chatContent, setChatContent] = useState("");
  const [chatData, setChatData] = useState([]);
  const [userList, setUserList] = useState([]);

  let listener;

  useEffect(() => {
    if (withChat && visible) {
      if (user.uid !== undefined) {
        fetchChatData();
      }
    }
  }, [withChat, user, visible]);

  useEffect(() => {
    getDataUserFromLocal();
  }, []);

  const getDataUserFromLocal = () => {
    getData("user").then((res) => {
      setUser(res);
    });
  };

  const fetchChatData = () => {
    listener = Fire.database()
      .ref("video_berbayar_chat/" + link)
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
  };

  const chatSend = (type) => {
    const today = new Date();

    const data = {
      sendBy: user.uid,
      chatDate: today.getTime(),
      chatTime: getChatTime(today),
      chatContent: chatContent,
      fullName: user?.fullName,
    };

    const urlFirebase = `video_berbayar_chat/${link}/${setDateChat(today)}`;

    Fire.database()
      .ref(urlFirebase)
      .push(data)
      .then(() => {
        setChatContent("");
      })
      .catch((err) => {
        showError(err.message);
      });
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <Modal animationType="fade" visible={visible} transparent>
      <View style={styles.container}>
        <YoutubePlayer
          height={Dimensions.get("screen").height / 4}
          play={playing}
          videoId={link}
          onChangeState={onStateChange}
        />
        {withChat ? (
          <>
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
              noImage
              onChangeText={(value) => setChatContent(value)}
              onButtonPress={() => chatSend()}
              type="group"
            />
          </>
        ) : null}
        <Gap height={8} />
        <Button title={playing ? "Pause" : "Play"} onPress={togglePlaying} />
        <TouchableOpacity
          onPress={() => {
            setPlaying(false);
            setChatContent("");
            setChatData([]);
            Fire.database()
              .ref("video_berbayar_chat/" + link)
              .off("value", listener);
            onClose && onClose();
          }}
          style={styles.btnClose}
        >
          <Text style={styles.btnCloseText}>Tutup</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.loadingBackground,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  content: {
    height: Dimensions.get("screen").height / 3,
    backgroundColor: colors.white,
  },
  chatDate: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginVertical: 20,
    textAlign: "center",
  },
  btnClose: {
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnCloseText: {
    fontSize: 18,
    fontFamily: fonts.primary[600],
    textAlign: "center",
    color: colors.white,
  },
});