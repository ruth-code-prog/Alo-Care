/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import React from 'react';
import { View } from 'react-native';
import { name as appName } from './app.json'
import { Provider as StoreProvider } from 'react-redux';
import 'react-native-gesture-handler'
import { configureStore, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'

const store = configureStore;
const RenderLoading = () => {
    return (
        <View />
    )
}
const HeadlessCheck = ({ isHeadless }) => {
    if (isHeadless) {
        // console.log('App launched by ios in background, ignore it.');
        return null;
    }

    return (
        <StoreProvider store={store}>
            <PersistGate persistor={persistor} loading={<RenderLoading />}>
                <App />
            </PersistGate>
        </StoreProvider>
    )
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);
