import React from 'react';
import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import {ILGetStarted, ILLogo} from '../../assets/illustration';
import {Button, Gap} from '../../components';
import {colors, fonts} from '../../utils';

const GetStarted = ({navigation}) => {
  return (
    <ImageBackground source={ILGetStarted} style={styles.page}>
      <View>
        <ILLogo />
        <Text style={styles.title}>
         Alo Care aplikasi Mobile Karya anak Indonesia
        </Text>
        <Text style={styles.body}>
         untuk peningkatan kualitas hidup
        </Text>
        <Text style={styles.fitur}>
         Fitur Baru: Investasi Finansial, Investasi Digital, Video Edukasi, dan Meet Room 
        </Text>
      </View>
      <View>
        <Button
          title="Daftar"
          onPress={() => navigation.navigate('Register')}
        />
        <Gap height={16} />
        <Button
          type="secondary"
          title="Masuk"
          onPress={() => navigation.replace('Login')}
        />
      </View>
    </ImageBackground>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    flex: 1,
  },
  title: {
    fontSize: 28,
    marginTop: 91,
    color: colors.white,
    fontFamily: fonts.primary[600],
  },
  body: {
    fontSize: 20,
    marginTop: 91,
    color: colors.white,
    fontFamily: fonts.primary[600],
  },
  fitur: {
    fontSize: 16,
    marginTop: 20,
    color: colors.white,
    fontFamily: fonts.primary[600],
  },
});
