import * as React from 'react';
import {
  Alert,
  Button,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '../components/Themed';
import { useState } from 'react';
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-community/async-storage';
import useColorScheme from '../hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useTranslation } from 'react-i18next';

export default function TabTwoScreen() {
  const theme = useColorScheme();
  const navigation = useNavigation();
  const [t] = useTranslation();
  const [outcomeList, setOutcomeList] = useState<{
    outcomes: { outcomeName: string; outcomeAmount: string; period: number; date: string; id: string }[];
  }>({ outcomes: [] });
  const [total, setTotal] = useState(0);
  const [payments, setPayments] = useState<{
    payments: { id: string; paid: boolean; date: string; name: string; amount: string }[];
  }>({
    payments: [],
  });
  useEffect(() => {
    navigation.addListener('focus', () => {
      // Screen was focused
      _retrieveData();
      _retrievePayments();
    });
  }, [navigation]);

  useEffect(() => {
    //AsyncStorage.removeItem('@Uoutcomes')
    //AsyncStorage.removeItem('@Upayments');
    _retrieveData();
    _retrievePayments();
  }, []);

  useEffect(() => {
    calculateTotalAmount();
  }, [outcomeList]);
  useEffect(() => {
    _storeTotalOutcome();
  }, [total]);

  function formatDate(date: Date) {
    let d = date,
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  const _retrieveData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@Uoutcomes');
      if (!jsonValue) return;
      setOutcomeList(JSON.parse(jsonValue));
    } catch (error) {
      console.dir(error);
    }
  };
  const _storeData = async (list: any) => {
    try {
      const jsonValue = JSON.stringify(list);

      await AsyncStorage.setItem('@Uoutcomes', jsonValue);
    } catch (error) {
      console.dir(error);
    }
  };
  const handleDeleteOutcome = async (id: string) => {
    /* comment */
    const list = outcomeList.outcomes.filter(item => item.id !== id);
    await _storeData({ outcomes: list });
    await _retrieveData();
  };
  const _retrievePayments = async () => {
    /* comment */
    try {
      const jsonValue = await AsyncStorage.getItem('@Upayments');
      if (!jsonValue) return;
      setPayments(JSON.parse(jsonValue));
    } catch (error) {
      console.dir(error);
    }
  };
  const _storePayments = async (payments: any) => {
    /* comment */
    try {
      const jsonValue = JSON.stringify(payments);

      await AsyncStorage.setItem('@Upayments', jsonValue);
    } catch (error) {
      console.dir(error);
    }
  };
  const handlePaid = async (id: string, name: string, amount: string) => {
    /* comment */
    const checkItem = payments.payments.filter(item => item.id === id);
    if (checkItem.length > 0) return;
    const item = { id: id, paid: true, date: formatDate(new Date()), name: name, amount: amount };
    //setPayments({ payments: [...payments.payments, item] });
    _storePayments({ payments: [...payments.payments, item] }).then(() => _retrievePayments());
  };
  const checkIsPaid = (id: string) => {
    /* comment */
    const checkIsPaid = payments.payments.filter(item => item.id === id);
    return checkIsPaid.length > 0;
  };
  const _storeTotalOutcome = async () => {
    try {
      await AsyncStorage.setItem('@totalOutcome', total.toString());
    } catch (error) {
      console.dir(error);
    }
  };
  const calculateTotalAmount = () => {
    /* comment */
    let total = 0;
    outcomeList.outcomes.forEach(item => {
      total += parseFloat(item.outcomeAmount);
    });
    setTotal(total);
  };
  const calcMonthsLeft = (date: string, period: number) => {
    /* comment */
    const d = new Date(date);
    const endDate = new Date(d.setMonth(d.getMonth() + period));
    const today = new Date();
    let difference = endDate.getFullYear() * 12 + endDate.getMonth() - (today.getFullYear() * 12 + today.getMonth());
    return difference;
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: 'transparent', alignItems: 'flex-end', padding: 20 }}>
        <Text style={{ fontSize: 20 }}>
          {t('Total')}: {total.toFixed(2)} ₺
        </Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.draggableList}>
        <SwipeListView
          data={outcomeList.outcomes}
          renderItem={(data, rowMap) => (
            <View style={[styles.listView]}>
              <LinearGradient
                // Button Linear Gradient
                colors={['#FF1919', '#E55D5D', '#E76D6D']}
                style={styles.awesomeIcon}
              >
                <AntDesign name="up" size={30} color={'white'} />
              </LinearGradient>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                  backgroundColor: 'transparent',
                  flex: 1,
                }}
              >
                <View style={{ backgroundColor: 'transparent', flex: 2 }}>
                  <Text style={[styles.listText]}>{data.item.outcomeName}</Text>
                  {/*<Text style={[styles.listTextInner]}>Outcome</Text>*/}
                  <Text style={[styles.listTextInner]}>
                    {t('On the')} <Text style={{ fontWeight: 'bold' }}>{data.item.date.split('-')[2]}</Text>{' '}
                    {t('of every month')}
                  </Text>
                  <Text style={[styles.listTextInner]}>
                    <Text style={{ fontWeight: 'bold' }}>{calcMonthsLeft(data.item.date, data.item.period)}</Text>{' '}
                    {t('months left')}
                  </Text>
                </View>
                <Text style={[styles.listTextMoney, styles.flex1]}>
                  ₺{parseFloat(data.item.outcomeAmount).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowHidden}>
              <View style={styles.rowLeft}>
                {checkIsPaid(data.item.id) ? (
                  <FontAwesome5 name="check" size={24} color="white" />
                ) : (
                  <TouchableOpacity
                    style={{ width: '50%', flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => handlePaid(data.item.id, data.item.outcomeName, data.item.outcomeAmount)}
                  >
                    <Text style={{ color: 'white', fontSize: 15 }}>{t('Mark as Paid')}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.rowRight}>
                <TouchableOpacity
                  style={{ width: '40%', flex: 1, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => handleDeleteOutcome(data.item.id)}
                >
                  <Text style={{ color: 'white', fontSize: 18 }}>{t('Delete')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          leftOpenValue={100}
          rightOpenValue={-90}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          marginVertical: 15,
        }}
      >
        <View
          style={{
            backgroundColor: '#FF1919',
            width: 60,
            height: 60,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddOutcomeScreen');
            }}
          >
            <IconView color="white" name="ios-add" sizeN={45} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function IconView(props: { name: string; color: string; sizeN: number }) {
  return <Ionicons size={props.sizeN} style={{ marginBottom: -3 }} {...props} />;
}

function FontAwesomeIconView(props: { name: string; color: string; sizeN: number }) {
  return <FontAwesome5 name={props.name} size={props.sizeN} color={props.color} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  draggableList: {
    marginHorizontal: 10,
    marginTop: 15,
    backgroundColor: 'transparent',
    flex: 1,
  },
  textInputView: {
    flex: 1,
    margin: 5,
    backgroundColor: 'rgba(209,209,209,0.32)',
    borderRadius: 6,
    padding: 5,
    height: 40,
  },
  listView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#eff2f5',
    marginVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    padding: 5,
    paddingLeft: 10,
  },

  itemActive: {
    backgroundColor: 'rgba(143,143,143,0.18)',
    marginHorizontal: 10,
  },
  listText: {
    fontSize: 16,
    fontWeight: '300',
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  listTextInner: {
    fontSize: 13,
    fontWeight: '200',
    flexWrap: 'wrap',
    textAlign: 'left',
    fontFamily: 'poppins-light',
    paddingLeft: 5,
  },
  listTextMoney: {
    fontSize: 14,
    fontWeight: '300',
    flexWrap: 'wrap',
    textAlign: 'right',
    paddingRight: 5,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  awesomeIcon: {
    borderRadius: 6,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    width: '100%',
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 200,
    width: 350,
  },
  rowHidden: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginVertical: 4,
    borderRadius: 8,
    justifyContent: 'space-between',
    height: '100%',
  },
  rowLeft: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#3FAC4D',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingLeft: 8,
  },
  rowRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#ff4141',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingRight: 8,
  },
});
