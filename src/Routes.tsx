import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react'
import { StatusBar } from 'react-native';
import { AppTabs } from './AppFlow/AppTabs';

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = ({}) => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar barStyle="light-content" />
      <AppTabs />
    </NavigationContainer>
  );
}