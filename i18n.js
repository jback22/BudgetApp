import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {Text} from "./components/Themed";
import * as React from "react";

i18n
  .use(initReactI18next)
  .init({
    // we init with resources
      lng:'tr',
    resources: {
      en: {
        translations: {
          'Incomes': 'Incomes',
          'Outcomes': 'Outcomes',
          'Total Earning': 'Total Earning',
          'Transactions': 'Transactions',
            'Spendings':'Spendings',
            'No Transaction Found!':'No Transaction Found!',
            'On the':'On the',
            'of every month':'of every month',
            'months left':'months left',
            'For':'For',
            'months':'months',
            'Delete':'Delete',
            'Income Name':'Income Name',
            'Income Amount':'Income Amount',
            'Select a Period':'Select a Period',
            'Select Period Date':'Select Period Date',
            'Outcome Name':'Outcome Name',
            'Outcome':'Outcome',
            'Outcome Amount':'Outcome Amount',
            'How many months left ?':'How many months left ?',
            'Select Start Date':'Select Start Date',
            'Month':'Month',
            'Year':'Year',
            'Period':'Period',
            'Income':'Income',
            'Amount':'Amount',
            'Wallet':'Wallet',
            'Mark as Paid':'Mark as Paid',
            'Total':'Total'
        },
      },
      tr: {
        translations: {
            'Incomes': 'Gelirler',
            'Outcomes': 'Giderler',
            'Total Earning': 'Toplam Kazanç',
            'Transactions': 'İşlemler',
            'Spendings':'Harcamalar',
            'No Transaction Found!':'Hiç işlem yok!',
            'On the':'Her ayın',
            'of every month':'. gününde',
            'months left':'ay kaldı',
            'For':'',
            'months':'ay boyunca',
            'Delete':'Sil',
            'Income Name':'Gelir Tanımı',
            'Income Amount':'Gelir Miktarı',
            'Select a Period':'Periyot Seçin',
            'Select Period Date':'Periyot Tarihi Belirleyin',
            'Outcome Name':'Gider Tanımı',
            'Outcome':'Gider',
            'Outcome Amount':'Gider Miktarı',
            'How many months left ?':'Kaç ay kaldı ?',
            'Select Start Date':'Başlangıç Tarihi Seçin',
            'Month':'Ay',
            'Year':'Yıl',
            'Period':'Periyot',
            'Income':'Gelir',
            'Amount':'Miktar',
            'Wallet':'Cüzdan',
            'Mark as Paid':'Ödendi olarak işaretle',
            'Total':'Toplam'

        },
      },
    },
    fallbackLng: 'tr',
    debug: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
