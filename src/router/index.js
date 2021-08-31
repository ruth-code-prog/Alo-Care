import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  GetStarted,
  Splash,
  Register,
  Login,
  UploadPhoto,
  OurStaff,
  Messages,
  Informasi,
  ChooseOurStaff,
  Chatting,
  UserProfile,
  UpdateProfile,
  OurStaffProfile,
  Detail,
  ForgotPass
} from '../pages';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigator} from '../components';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomNavigator {...props} />}>
      <Tab.Screen name="Home" component={OurStaff} />
      <Tab.Screen name="Pesan" component={Messages} />
      <Tab.Screen name="Informasi" component={Informasi} />
    </Tab.Navigator>
  );
};

export default function Router() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UploadPhoto"
        component={UploadPhoto}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChooseOurStaff"
        component={ChooseOurStaff}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Chatting"
        component={Chatting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OurStaffProfile"
        component={OurStaffProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
