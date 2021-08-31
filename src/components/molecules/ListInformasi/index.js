import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {colors, fonts} from '../../../utils';

const ListInformasi = ({title, price, image, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{uri: image}} style={styles.picture} />
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.title}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ListInformasi;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  body: {
    width: '70%',
  },
  picture: {width: 80, height: 60, borderRadius: 11, marginRight: 16},
  title: {
    fontSize: 16,
    fontFamily: fonts.primary.normal,
    color: colors.text.primary,
  },
  address: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors.text.secondary,
    marginTop: 6,
  },
});
