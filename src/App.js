import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import FlashMessage from 'react-native-flash-message'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { Loading } from './components'
import store from './redux/store'
import Router from './router'
import { YellowBox } from 'react-native'
import {localNotificationService} from './fcm/LocalNotificationService'
import {fcmService} from './fcm/FCMService'
import firebase from '@react-native-firebase/app';
import { credentials, config } from './config'
const MainApp = () => {
  const stateGlobal = useSelector((state) => state)
  const navigationRef = useRef(null);
  const dispatch = useDispatch();
  const { route, param } = useSelector(state => state.notifikasi);
  useEffect(() => {
    if (route != "") {
      const { navigate } = navigationRef.current;
      navigate(route,param);
      dispatch({type:"REMOVENOTIFIKASI", data:null});
    }
  })
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Router />
      </NavigationContainer>
      <FlashMessage position="top" />
      {stateGlobal.loading && <Loading />}
    </>
  )
}

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    firebase.initializeApp(credentials, config);
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.createChannelManagement();
    localNotificationService.configure(onOpenNotification)

    function onRegister(token) {
      if (token) {
        dispatch({ data: token, type: "ADDFCM" });
      }
    }

    function onNotification(notify) {
      if (notify !== undefined) {
        console.log("[NOTIFIKASI]", notify)
        // console.log(`[App] onNotification ${Platform.OS}:`, notify);
        const options = {
          soundName: 'default',
          playSound: true
        }
        localNotificationService.showNotification(
          Math.floor(Math.random() * 100),
          notify.title,
          notify.body,
          notify,
          options
        )
      }
    }

    function onOpenNotification(notify) {
      if (notify.moreData) {
        let data = JSON.parse(notify.moreData);
        dispatch({ type: 'ADDNOTIFIKASI', data: { route: "Chatting", param: data } });
      }
    }

    return () => {
      fcmService.unRegister()
      localNotificationService.unregister()
    }
  }, [])
  return (
    <MainApp />
  )
}

export default App
