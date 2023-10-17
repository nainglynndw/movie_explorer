import {Dimensions, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const hasInternet = async () => {
  return (await NetInfo.fetch()).isInternetReachable;
};

export const isAndroid = Platform.OS === 'android';
