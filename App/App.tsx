import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './store/Store';
import RootNavigator from './navigators/RootNavigator';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootNavigator />
        <Toast />
      </PersistGate>
    </Provider>
  );
};

export default App;
