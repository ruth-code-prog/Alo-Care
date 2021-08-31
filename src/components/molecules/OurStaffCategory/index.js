import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ILCatBm, ILCatSe, ILCatPerawat, ILCatAdmin, ILCatBabyspa, ILCatBarber, ILCatRr} from '../../../assets';
import {colors, fonts} from '../../../utils';

export default function OurStaffCategory({category, onPress}) {
  const Icon = () => {
    if (category === 'Admin') {
      return <ILCatAdmin style={styles.illustration} />;
    }
    if (category === 'Perawat') {
      return <ILCatPerawat style={styles.illustration} />;
    }
    if (category === 'Service Elektronik') {
      return <ILCatSe style={styles.illustration} />;
    }
    if (category === 'Body Massage') {
      return <ILCatBm style={styles.illustration} />;
    }
    if (category === 'Baby Massage') {
      return <ILCatBabyspa style={styles.illustration} />;
    }
    if (category === 'Barber') {
      return <ILCatBarber style={styles.illustration} />;
    }
    if (category === 'Renovasi Rumah') {
      return <ILCatRr style={styles.illustration} />;
    }
    return <ILCatAdmin style={styles.illustration} />;
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon />
    <Text style={styles.category}>{category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: colors.cardLight,
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginRight: 10,
    width: 100,
    height: 140,
  },
  illustration: {
    marginBottom: 28,
    marginLeft:14,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors.text.primary,
  },
  category: {
    fontSize: 12,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginLeft: 16,
  },
});
