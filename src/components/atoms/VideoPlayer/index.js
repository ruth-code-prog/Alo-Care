import React, { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Button } from "..";
import { colors, fonts } from "../../../utils";

const VideoPlayer = ({ link, visible, onClose }) => {
  const [playing, setPlaying] = useState(false);

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
          height={300}
          play={playing}
          videoId={link}
          onChangeState={onStateChange}
        />
        <Button title={playing ? "Pause" : "Play"} onPress={togglePlaying} />
        <TouchableOpacity
          onPress={() => {
            setPlaying(false);
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
