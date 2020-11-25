import * as React from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Button,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {View, Text} from "../components/Themed";
import {Ionicons, FontAwesome5, AntDesign} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import DraggableFlatList from "react-native-draggable-flatlist";
import AsyncStorage from "@react-native-community/async-storage";
import useColorScheme from "../hooks/useColorScheme";
import DatePicker from "react-native-datepicker";
import RNPickerSelect from 'react-native-picker-select';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";



export default function TabOneScreen() {
    const theme = useColorScheme();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [incomeList, setIncomeList] = useState<{
        incomes: { incomeName: string; incomeAmount: string; period: number; date: string; id: string }[];
    }>({incomes: []});
    const [total, setTotal] = useState(0);

    useEffect(() => {
        navigation.addListener('focus', () => {
            // Screen was focused
            _retrieveData();
            console.log('income');
        });
    }, [navigation]);

    useEffect(() => {
        _retrieveData();
    }, []);
    useEffect(() => {
        calculateTotalAmount();
    }, [incomeList]);
    useEffect(() => {
        _storeTotalIncome();
    }, [total]);

    const _retrieveData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@Uincomes");
            if (!jsonValue) return;
            setIncomeList(JSON.parse(jsonValue));
        } catch (error) {
            console.dir(error);
        }
    };
    const _storeData = async (list:any) => {
        try {
            const jsonValue = JSON.stringify(list);

            await AsyncStorage.setItem("@Uincomes", jsonValue);
        } catch (error) {
            console.dir(error);
        }
    };
    const handleDeleteIncome = async (id: string) => {
        /* comment */
        const list = incomeList.incomes.filter((item) => item.id !== id);
        await _storeData({incomes: list});
        await _retrieveData();
    };
    const _storeTotalIncome = async ()=>{
        try {
            await AsyncStorage.setItem("@totalIncome", total.toString());
        } catch (error) {
            console.dir(error);
        }
    }
    const calculateTotalAmount = () => {
        if (!incomeList.incomes) return;
        /* comment */
        let total = 0;
        incomeList.incomes.forEach((item) => {
            total += parseFloat(item.incomeAmount);
        });
        setTotal(total);
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={{backgroundColor:'transparent',alignItems:'flex-end',padding:20,}}>
                <Text style={{fontSize:20}}>{t('Total')}: {total.toFixed(2)} ₺</Text>
            </View>
            <View
                style={styles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
            />

            <View style={styles.draggableList}>
                <SwipeListView
                    data={incomeList.incomes}
                    renderItem={(data, rowMap) => (
                        <View style={[styles.listView]}>
                            <LinearGradient
                                // Button Linear Gradient
                                colors={["#3FAC4D", "#47c056", "#78C482"]}
                                style={styles.awesomeIcon}
                            >
                                <AntDesign name="up" size={30} color={"white"}/>
                            </LinearGradient>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginLeft: 20,
                                    backgroundColor: "transparent",
                                    flex: 1,
                                }}
                            >
                                <View style={{backgroundColor: "transparent", flex: 2}}>
                                    <Text style={[styles.listText]}>{data.item.incomeName}</Text>
                                   {/* <Text style={[styles.listTextInner]}>Income</Text>*/}
                                    <Text style={[styles.listTextInner]}>{t('On the')} <Text style={{fontWeight:'bold'}}>{data.item.date.split('-')[2]}</Text> {t('of every month')} </Text>
                                    <Text style={[styles.listTextInner]}>{t('For')} <Text style={{fontWeight:'bold'}}>{data.item.period}</Text> {t('months')}</Text>
                                </View>
                                <Text style={[styles.listTextMoney, styles.flex1]}>
                                    ₺{parseFloat(data.item.incomeAmount).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={styles.rowHidden}>
                            <View style={styles.rowLeft}>
                                <TouchableOpacity

                                    //onPress={() => closeRow(rowMap, data.item.key)}
                                >
                                    <Text style={{color: 'white', fontSize: 15}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.rowRight}>
                                <TouchableOpacity
                                    style={{width:'40%',flex:1,alignItems:'center',justifyContent:'center'}}
                                    onPress={() => handleDeleteIncome(data.item.id)}
                                >
                                    <Text style={{color: 'white', fontSize: 18}}>{t('Delete')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    leftOpenValue={0}
                    rightOpenValue={-90}
                />
            </View>
            <View
                style={{
                    width: '100%',
                    height: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    marginVertical:15
                }}
            >
               <View style={{
                   backgroundColor: "#3FAC4D",
                   width: 60,
                   height: 60,
                   borderRadius: 25,
                   alignItems: "center",
                   justifyContent: "center",
               }}>
                   <TouchableOpacity onPress={()=>{
                       navigation.navigate('AddIncomeScreen')
                   }}>
                       <IconView color="white" name="ios-add" sizeN={45}/>
                   </TouchableOpacity>
               </View>
            </View>
        </SafeAreaView>
    );
}
// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function IconView(props: { name: string; color: string; sizeN: number }) {
    return (
        <Ionicons size={props.sizeN} style={{marginBottom: -3}} {...props} />
    );
}

function FontAwesomeIconView(props: {
    name: string;
    color: string;
    sizeN: number;
}) {
    return (
        <FontAwesome5 name={props.name} size={props.sizeN} color={props.color}/>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollView: {
        marginHorizontal: 20,
        marginTop: 15,
    },
    draggableList: {
        marginHorizontal: 10,
        marginTop: 15,
        backgroundColor: "transparent",
        flex: 1,
    },
    textInputView: {
        flex: 1,
        margin: 5,
        backgroundColor: "rgba(209,209,209,0.32)",
        borderRadius: 6,
        padding: 5,
        height: 40,
    },
    listView: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#eff2f5",
        marginVertical: 4,
        borderRadius: 8,
        alignItems: "center",
        padding: 5,
        paddingLeft: 10,
    },

    itemActive: {
        backgroundColor: "rgba(143,143,143,0.18)",
        marginHorizontal: 10,
    },
    listText: {
        fontSize: 16,
        fontWeight: "300",
        flexWrap: "wrap",
        textAlign: "left",
    },
    listTextInner: {
        fontSize: 13,
        fontWeight: "200",
        flexWrap: "wrap",
        textAlign: "left",
        fontFamily: "poppins-light",
        paddingLeft: 5,
    },
    listTextMoney: {
        fontSize: 14,
        fontWeight: "300",
        flexWrap: "wrap",
        textAlign: "right",
        paddingRight: 5
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
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        height: 1,
        width: "100%",
    },
    linearGradient: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        height: 200,
        width: 350,
    },
    rowHidden: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        marginVertical: 4,
        borderRadius: 8,
        justifyContent: "space-between",
        height:'100%'

    },
    rowLeft: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#3FAC4D',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: 8
    },
    rowRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: '#ff4141',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        paddingRight: 8
    }
});
