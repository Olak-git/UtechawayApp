/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { LogBox, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import { ignoreLogs } from './functions/functions';
import store from './app/store';
import GenerateView from './route/GenerateView';
import Orientation from 'react-native-orientation-locker';
import { Root } from 'react-native-alert-notification';
import { NotifierWrapper } from 'react-native-notifier';

// ignoreLogs();
LogBox.ignoreAllLogs();
Orientation.lockToPortrait();

const Stack = createNativeStackNavigator();

let persistor = persistStore(store)

interface AppProps {
}
const App: React.FC<AppProps> = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NotifierWrapper>
          <GenerateView />
        </NotifierWrapper>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
