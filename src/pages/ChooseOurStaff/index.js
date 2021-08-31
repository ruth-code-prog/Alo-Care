import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Header, List} from '../../components';
import {Fire} from '../../config';
import {colors} from '../../utils';

const ChooseOurStaff = ({navigation, route}) => {
  const [listOurstaff, setListOurstaff] = useState([]);
  const itemCategory = route.params;
  useEffect(() => {
    callOurstaffByCategory(itemCategory.category);
  }, [itemCategory.category]);

  const callOurstaffByCategory = category => {
    Fire.database()
      .ref('ourstaffs/')
      .orderByChild('category')
      .equalTo(category)
      .once('value')
      .then(res => {
        console.log('data list ourstaff: ', res.val());
        if (res.val()) {
          const oldData = res.val();
          const data = [];
          Object.keys(oldData).map(item => {
            data.push({
              id: item,
              data: oldData[item],
            });
          });
          console.log('parse list ourstaff: ', data);
          setListOurstaff(data);
        }
      });
  };
  return (
    <View style={styles.page}>
      <Header
        type="dark"
        title={`Pilih ${itemCategory.category}`}
        onPress={() => navigation.goBack()}
      />
      {listOurstaff.map(ourstaff => {
        return (
          <List
            key={ourstaff.id}
            type="next"
            profile={{uri: ourstaff.data.photo}}
            name={ourstaff.data.fullName}
            desc={ourstaff.data.gender}
            onPress={() => navigation.navigate('OurStaffProfile', ourstaff)}
          />
        );
      })}
    </View>
  );
};

export default ChooseOurStaff;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
});
