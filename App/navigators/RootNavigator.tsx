import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import AppNavigator from './AppNavigator';

const RootNavigator = () => {
  const {userData} = useSelector((state: RootState) => state.user);
  return (
    <NavigationContainer>
      {userData ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
