import * as React from 'react';
import { View, Text } from '../components/Themed';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Button,
} from 'react-native';
import useColorScheme from '../hooks/useColorScheme';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [payments, setPayments] = useState<{
    payments: { id: string; paid: boolean; date: string; name: string; amount: string }[];
  }>({
    payments: [],
  });
  const [totalIncome, setTotalIncome] = useState<string>('');
  const [totalOutcome, setTotalOutcome] = useState<string>('');

  useEffect(() => {
    navigation.addListener('focus', () => {
      // Screen was focused
      _retrieveTotalIncome();
      _retrieveTotalOutcome();
      _retrievePayments();
    });
  }, [navigation]);

  useEffect(() => {
    _retrieveTotalIncome();
    _retrieveTotalOutcome();
    _retrievePayments();
  }, []);

  const _retrievePayments = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@Upayments');
      if (!jsonValue) return;
      setPayments(JSON.parse(jsonValue));
    } catch (error) {
      console.dir(error);
    }
  };
  const _retrieveTotalIncome = async () => {
    try {
      const totalIncome = await AsyncStorage.getItem('@totalIncome');
      if (!totalIncome) return;
      setTotalIncome(totalIncome);
    } catch (error) {
      console.dir(error);
    }
  };
  const _retrieveTotalOutcome = async () => {
    try {
      const totalOutcome = await AsyncStorage.getItem('@totalOutcome');
      if (!totalOutcome) return;
      setTotalOutcome(totalOutcome);
    } catch (error) {
      console.dir(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.total}>
        <Text style={{ fontSize: 16 }}>{t('Total Earning')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>₺</Text>
          <Text style={{ fontSize: 40, fontWeight: 'bold' }}>
            {totalIncome && totalOutcome ? parseFloat(totalIncome) - parseFloat(totalOutcome) : 0}
          </Text>
        </View>
      </View>
      <View style={styles.listView}>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => {
            navigation.navigate('Incomes');
          }}
        >
          <View style={styles.listItem}>
            <AntDesign name="arrowup" size={40} color={'#3FAC4D'} />
            <View style={styles.item}>
              <Text style={{ fontSize: 14, color: '#5f5b5b' }}>{t('Incomes')}</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>₺{totalIncome ? totalIncome : 0}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => {
            navigation.navigate('Outcomes');
          }}
        >
          <View style={styles.listItem}>
            <AntDesign name="arrowdown" size={40} color={'#FF1919'} />
            <View style={styles.item}>
              <Text style={{ fontSize: 14, color: '#5f5b5b' }}>{t('Spendings')}</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>₺{totalOutcome ? totalOutcome : 0}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.trans}>
        <View style={styles.transHeader}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{t('Transactions')}</Text>
          <Text style={{ fontSize: 22 }}>:</Text>
        </View>
        <ScrollView>
          {payments.payments.length ? (
            payments.payments.map(payment => (
              <View key={payment.id} style={styles.transItem}>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', paddingBottom: 5 }}>
                    {payment.name} has been paid.
                  </Text>
                  <Text style={{ fontSize: 13, paddingBottom: 5 }}>{payment.date}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 5 }}>- ₺{payment.amount}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
              <Text>{t('No Transaction Found!')}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listView: {
    display: 'flex',
    height: 120,
    flexDirection: 'row',
    backgroundColor: '#f0f9fd',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    padding: 5,
    paddingLeft: 10,
  },
  listItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  total: {
    display: 'flex',
    height: 200,
    flexDirection: 'column',
    backgroundColor: '#f0f9fd',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingLeft: 10,
  },
  trans: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  transHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transItem: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#cecece',
    marginBottom: 5,
  },
});
