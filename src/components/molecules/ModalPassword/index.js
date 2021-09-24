import React, { useState } from "react";
import { Alert, Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import { Button, Gap, Input } from "../..";
import { Fire } from "../../../config";
import { colors } from "../../../utils";

const ModalPassword = ({ visible, onSubmit, onClose, type }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(null);

  const handleSubmit = () => {
    if (!password) {
      return Alert.alert("Password wajib diisi");
    }

    if (type !== "simple") {
      setLoading(true);
      Fire.database()
        .ref("video_password")
        .once("value")
        .then((snapshot) => {
          console.log(snapshot.val());
          if (snapshot.val() === password) {
            onSubmit && onSubmit();
          } else {
            Alert.alert("Password yang Anda masukkan salah");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      onSubmit && onSubmit(password);
    }
    setPassword(null);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Input
            onChangeText={(val) => setPassword(val)}
            value={password}
            label="Password Video Berbayar"
            secureTextEntry
            placeholder="Masukkan password"
          />
          <Gap height={24} />
          <Button onPress={handleSubmit} disable={loading} title="Submit" />
          <Gap height={8} />
          <Button
            type="secondary"
            onPress={() => onClose && onClose()}
            disable={loading}
            title="Tutup"
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalPassword;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.loadingBackground,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    width: Dimensions.get("screen").width - 40,
    padding: 20,
  },
});
