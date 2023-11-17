// App.js
import React from "react";
import { Provider as StoreProvider } from "react-redux";

import { I18nextProvider } from "react-i18next";
import AppStack from "./src/navigation/appStack";
import { LogBox } from "react-native";

import store from "./src/store/configureStore";
import i18n from "./src/i18n/i18n";
LogBox.ignoreAllLogs();
const App = () => {
  return (
    <StoreProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppStack />
      </I18nextProvider>
    </StoreProvider>
  );
};

export default App;
