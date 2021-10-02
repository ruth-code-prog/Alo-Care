import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
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
  ForgotPass,
  ChattingGroup,
  Wishlist,
  UserInvestation,
  ListTransaction,
  TransactionDetail,
  MemberAlocare,
  PaidVideo,
  FinancePage,
  VideoPage,
  ProductPage,
  WebsitePage,
} from "../pages";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigator } from "../components";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator tabBar={(props) => <BottomNavigator {...props} />}>
      <Tab.Screen name="Home" component={OurStaff} />
      <Tab.Screen name="Pesan" component={Messages} />
      <Tab.Screen name="Layanan" component={Informasi} />
      <Tab.Screen name="Daftar Transaksi" component={ListTransaction} />
    </Tab.Navigator>
  );
};

export default function Router() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UploadPhoto"
        component={UploadPhoto}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChooseOurStaff"
        component={ChooseOurStaff}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chatting"
        component={Chatting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChattingGroup"
        component={ChattingGroup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OurStaffProfile"
        component={OurStaffProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserInvestation"
        component={UserInvestation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MemberAlocare"
        component={MemberAlocare}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaidVideo"
        component={PaidVideo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FinancePage"
        component={FinancePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoPage"
        component={VideoPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductPage"
        component={ProductPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WebsitePage"
        component={WebsitePage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
