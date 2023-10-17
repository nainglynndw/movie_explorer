import {SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {WEB_CLIENT_ID} from '../../utils/constants';
import {useDispatch} from 'react-redux';
import {setUserData} from '../../store/User/UserSlice';
import Toast from 'react-native-toast-message';
import {colors} from '../../theme/colors';

const LoginScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
  }, []);

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        dispatch(setUserData({userData: userInfo}));
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: 'User Cancelled Login',
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: 'Login is still processing',
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: 'Google play service is not available',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: 'Google Login Error',
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoogleSigninButton onPress={googleLogin} style={styles.btn} />
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark.primary,
  },
  btn: {
    backgroundColor: colors.dark.accent,
  },
});
