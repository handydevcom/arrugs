import React from 'react';
import {
  StatusBar, Platform, SafeAreaView,
} from 'react-native';
import AppNavigator from './routes';
import NavigationService from './NavigationService';

const AppWithNavigationState = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#2a2c2d' }}>
    {
      Platform.OS === 'android'
      && <StatusBar backgroundColor="#2a2c2d" barStyle="light-content" />
    }
    <AppNavigator
      key="AppNavigator"
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
  </SafeAreaView>
);

export default AppWithNavigationState;
