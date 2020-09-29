import * as React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {View, Text} from '../components/Themed';
import {Ionicons, FontAwesome5} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import DraggableFlatList from "react-native-draggable-flatlist";
import AsyncStorage from '@react-native-community/async-storage';
import useColorScheme from "../hooks/useColorScheme";


export default function TabOneScreen() {
    const theme = useColorScheme();

    const [incomeName, setIncomeName] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeList, setIncomeList] = useState<{ incomes: { incomeName: string; incomeAmount: string; id: number; }[]; }>({incomes: []});
    const [total, setTotal] = useState(0)
    useEffect(() => {
        _retrieveData();
    }, [])
    useEffect(() => {
        calculateTotalAmount();
        _storeData();

    }, [incomeList]);

    const handleIncomeList = () => {
        if (!incomeName || !incomeAmount) return;
        const arr = {incomeName: incomeName, incomeAmount: incomeAmount, id: incomeList.incomes.length + 1};
        const list = {incomes: [...incomeList.incomes, arr]};
        setIncomeList(list);
        setIncomeName('');
        setIncomeAmount('')
    };
    const _storeData = async () => {
        try {
            const jsonValue = JSON.stringify(incomeList);

            await AsyncStorage.setItem(
                '@Uincomes',
                jsonValue
            );
        } catch (error) {
            console.dir(error)
        }
    };

    const _retrieveData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@Uincomes');
            if (!jsonValue) return;
            setIncomeList(JSON.parse(jsonValue))

        } catch (error) {
            console.dir(error)
        }
    };
    const handleDeleteIncome = (id: number) => {
        /* comment */
        const list = incomeList.incomes.filter(item => item.id !== id);
        console.log(list);
        setIncomeList({incomes: list})
    };
    const calculateTotalAmount = () => {
        if (!incomeList.incomes) return;
        /* comment */
        let total = 0;
        incomeList.incomes.forEach((item) => {
            total += parseInt(item.incomeAmount)
        });
        setTotal(total)
    };

    const renderItem = ({item, index, drag, isActive}: any) => {
        return (
            <TouchableOpacity
                onPressIn={drag}
                onLongPress={() => Alert.alert(
                    "Gelir silinecek!",
                    "",
                    [
                        {
                            text: "İptal",
                            style: "cancel"
                        },
                        {text: "Sil", onPress: () => handleDeleteIncome(item.id)}
                    ],
                    {cancelable: false}
                )}
            >
                <View style={styles.listView}>
                    <View style={styles.awesomeIcon}>
                        <FontAwesomeIconView name={"money-check-alt"} color={'#85bb65'} sizeN={40}/>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                        backgroundColor: 'transparent'
                    }}>
                        <Text style={styles.listText}>{item.incomeName}</Text>
                        <Text> = </Text>
                        <Text style={styles.listText}>{item.incomeAmount} ₺</Text>
                    </View>
                </View>
            </TouchableOpacity>

        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: 'transparent',
                marginHorizontal:15,
                marginTop:20
            }}>
                <View style={styles.textInputView}>
                    <TextInput style={{height: '100%', paddingLeft: 8,color:`${theme === "light" ? '#000':'#fff'}`}}
                               onChangeText={text => setIncomeName(text)}
                               value={incomeName}
                               clearTextOnFocus={false}
                               keyboardType={"default"}
                               placeholder={"Gelir tanımı"}/>

                </View>
                <View style={styles.textInputView}>
                    <TextInput style={{height: '100%', paddingLeft: 8,color:`${theme === "light" ? '#000':'#fff'}`}}
                               onChangeText={text => setIncomeAmount(text)}
                               value={incomeAmount}
                               clearTextOnFocus={false}
                               keyboardType={"number-pad"}
                               placeholder={"Gelir miktarı"}/>

                </View>
                <View style={{
                    backgroundColor: '#00CD00',
                    width: 30,
                    height: 30,
                    margin: 5,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity onPress={handleIncomeList}>
                        <IconView color="white" name="ios-add" sizeN={30}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>

            <ScrollView>
                <View style={styles.draggableList}>

                    <DraggableFlatList
                        data={incomeList.incomes}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.id}`}
                        onDragEnd={({data}) => setIncomeList({incomes: data})}
                    />
                </View>
            </ScrollView>
            <View style={{backgroundColor: 'transparent', marginBottom: 5, marginHorizontal: 20}}>
                <LinearGradient
                    // Button Linear Gradient
                    colors={['#00CD00', 'rgba(0,205,0,0.55)']}
                    style={{padding: 15, justifyContent: 'center', flexDirection: 'row', borderRadius: 8,marginBottom:5}}>
                    <Text
                        style={{
                            backgroundColor: 'transparent',
                            fontSize: 24,
                            fontWeight: '700',
                            color: '#fff',
                        }}>
                        Toplam Gelir =
                    </Text>
                    <Text style={{
                        backgroundColor: 'transparent',
                        fontSize: 24,
                        fontWeight: '700',
                        color: '#fff',
                    }}> {total} ₺</Text>
                </LinearGradient>
            </View>
        </SafeAreaView>

    );
}
// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function IconView(props: { name: string; color: string; sizeN: number }) {
    return <Ionicons size={props.sizeN} style={{marginBottom: -3}} {...props} />;
}

function FontAwesomeIconView(props: { name: string; color: string; sizeN: number }) {
    return <FontAwesome5 name={props.name} size={props.sizeN} color={props.color}/>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    scrollView: {
        marginHorizontal: 20,
        marginTop: 15,
    },
    draggableList: {
        marginHorizontal: 20,
        marginTop: 15,
        backgroundColor: 'transparent',
        flex:1
    },
    textInputView: {
        flex: 1,
        margin: 5,
        backgroundColor: 'rgba(209,209,209,0.32)',
        borderRadius: 6,
        padding: 5,
        height:40
    },
    listView: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(227,227,227,0.33)',
        marginVertical: 4,
        borderRadius: 8,
        alignItems: 'center',
        padding: 5,
        paddingLeft: 10
    },
    listText: {
        fontSize: 16,
        fontWeight: '300',
        flexWrap: 'wrap',
        flex: 1,
    },
    awesomeIcon: {
        backgroundColor: 'transparent'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 10,
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
});
