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
import {View, Text} from "../components/Themed";
import useColorScheme from "../hooks/useColorScheme";
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {useEffect} from "react";
import RNPickerSelect from "react-native-picker-select";
import DatePicker from "react-native-datepicker";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";


export default function AddIncomeScreen() {
    const theme = useColorScheme();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [incomeName, setIncomeName] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [incomeList, setIncomeList] = useState<{
        incomes: { incomeName: string; incomeAmount: string; period: number; date: string; id: string }[];
    }>({incomes: []});
    const [period, setPeriod] = useState(1);
    const [date, setDate] = useState(formatDate(new Date()));

    useEffect(() => {
        _retrieveData();
    }, []);
    useEffect(() => {
        _storeData();
    }, [incomeList]);


    function formatDate(date: Date) {
        let d = date,
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const handleIncomeList = () => {
        if (!incomeName || !incomeAmount) return;
        const arr = {
            incomeName: incomeName,
            incomeAmount: incomeAmount,
            period: period,
            date: date,
            id: "_" + Math.random().toString(36).substr(2, 9),
        };
        const list = {incomes: [...incomeList.incomes, arr]};
        setIncomeList(list);
        setIncomeName("");
        setIncomeAmount("");
        Keyboard.dismiss();
        navigation.navigate('TabOneScreen')
    };

    const _storeData = async () => {
        try {
            const jsonValue = JSON.stringify(incomeList);

            await AsyncStorage.setItem("@Uincomes", jsonValue);
        } catch (error) {
            console.dir(error);
        }
    };

    const _retrieveData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@Uincomes");
            if (!jsonValue) return;
            setIncomeList(JSON.parse(jsonValue));
        } catch (error) {
            console.dir(error);
        }
    };
    const handleDeleteIncome = (id: string) => {
        /* comment */
        const list = incomeList.incomes.filter((item) => item.id !== id);
        setIncomeList({incomes: list});
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={{flex: 1}}>
                <View style={styles.textInputView}>
                    <Text>{t('Income Name')}</Text>
                    <TextInput
                        style={{
                            height: '60%',
                            paddingLeft: 8,
                            color: `${theme === "light" ? "#000" : "#fff"}`,
                            backgroundColor: "rgba(209,209,209,0.32)",
                            borderRadius: 6

                        }}
                        onChangeText={(text) => setIncomeName(text)}
                        value={incomeName}
                        clearTextOnFocus={false}
                        keyboardType={"default"}
                        placeholder={t('Income')}
                    />
                </View>
                <View style={styles.textInputView}>
                    <Text>{t('Income Amount')}</Text>
                    <TextInput
                        style={{
                            height: '60%',
                            paddingLeft: 8,
                            color: `${theme === "light" ? "#000" : "#fff"}`,
                            backgroundColor: "rgba(209,209,209,0.32)",
                            borderRadius: 6
                        }}
                        onChangeText={(text) => setIncomeAmount(text)}
                        value={incomeAmount}
                        clearTextOnFocus={false}
                        keyboardType={"number-pad"}
                        placeholder={t("Amount")}
                    />
                </View>
                <View style={styles.textInputView}>
                    <Text>{t('Select a Period')}</Text>
                    <RNPickerSelect
                        value={period}
                        placeholder={{label: t('Period'), value: null}}
                        onValueChange={(value) => setPeriod(value)}
                        items={[
                            {label: `1 ${t('Year')}`, value: 12, key: 12},
                            {label: `1 ${t('Month')}`, value: 1, key: 1},
                            {label: `2 ${t('Month')}`, value: 2, key: 2},
                            {label: `3 ${t('Month')}`, value: 3, key: 3},
                            {label: `4 ${t('Month')}`, value: 4, key: 4},
                            {label: `5 ${t('Month')}`, value: 5, key: 5},
                            {label: `6 ${t('Month')}`, value: 6, key: 6},
                            {label: `7 ${t('Month')}`, value: 7, key: 7},
                            {label: `8 ${t('Month')}`, value: 8, key: 8},
                            {label: `9 ${t('Month')}`, value: 9, key: 9},
                            {label: `10 ${t('Month')}`, value: 10, key: 10},
                            {label: `11 ${t('Month')}`, value: 11, key: 11},

                        ]}
                        style={{
                            iconContainer: {
                                top: 20,
                                right: 10,
                            },
                            placeholder: {
                                fontSize: 16,
                                fontWeight: '500',
                            },
                            viewContainer: {
                                // marginLeft: 10,
                                backgroundColor: "rgba(209,209,209,0.32)",
                                borderRadius: 6,
                                height: '40%',
                                justifyContent: 'center',
                                paddingLeft: 10
                            }
                        }}
                    />
                </View>
                <View style={styles.textInputView}>
                    <Text>{t('Select Period Date')}</Text>
                    <DatePicker
                        style={{height: '40%', width: '100%'}}
                        date={date}
                        mode="date"
                        placeholder="Select date"
                        format="YYYY-MM-DD"
                        minDate="2020-01-01"
                        maxDate="2022-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        onDateChange={(dateStr => setDate(dateStr))}
                        customStyles={{
                            dateInput: {
                                borderRadius: 6,

                            },
                            // ... You can check the source to find the other keys.
                        }}
                        //onDateChange={(date) => {this.setState({date: date})}}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",

                    }}
                >
                    <View style={{
                        backgroundColor: "#3FAC4D",
                        width: '90%',
                        borderRadius: 6,
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <TouchableOpacity style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}
                                          onPress={handleIncomeList}>
                            <IconView color="white" name="ios-add" sizeN={40}/>
                        </TouchableOpacity>
                    </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    textInputView: {
        flex: 1,
        margin: 5,
        //backgroundColor: "rgba(209,209,209,0.32)",
        borderRadius: 6,
        padding: 5,
        height: 40,
        justifyContent: 'center'
    },

    flex1: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
    }
});
