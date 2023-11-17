// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import zh_tw from "./zh_tw";
import jp from "./jp";
import kr from "./kr";
import en from "./en";

i18n.use(initReactI18next).init({
  resources: {
    zh_tw: zh_tw,
    jp: jp,
    kr: kr,
    en: en,
  },
  fallbackLng: "jp",
  compatibilityJSON: "v3",
  interpolation: {
    escapeValue: false,
  },
  lng: "jp",
});

export default i18n;
