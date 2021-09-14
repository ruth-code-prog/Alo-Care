import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  IconMessages,
  IconMessagesActive,
  IconInformasi,
  IconInformasiActive,
  IconOurstaff,
  IconOurstaffActive,
  IconHome,
  IconHomeActive,
} from '../../../assets';
import {colors, fonts} from '../../../utils';

const TabItem = ({title, active, onPress, onLongPress}) => {
  const Icon = () => {
    if (title === 'Home') {
      return active ? <IconHomeActive /> : <IconHome />;
    }
    if (title === 'Pesan') {
      return active ? <IconMessagesActive /> : <IconMessages />;
    }
    if (title === 'Informasi') {
      return active ? <IconInformasiActive /> : <IconInformasi />;
    }
    if (title === 'Daftar Transaksi') {
      return active ? <IconInformasiActive /> : <IconInformasi />;
    }
    return <IconOurstaff />;
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}>
      <Icon />
      <Text style={styles.text(active)}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: {alignItems: 'center'},
  text: active => ({
    fontSize: 10,
    color: active ? colors.text.menuActive : colors.text.menuInactive,
    fontFamily: fonts.primary[600],
    marginTop: 4,
  }),
});
