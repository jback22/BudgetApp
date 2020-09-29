import * as React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {Text, View} from '../components/Themed';
import {useState} from "react";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {useEffect} from "react";
import DraggableFlatList from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-community/async-storage';
import useColorScheme from "../hooks/useColorScheme";


export default function TabTwoScreen() {
    const theme = useColorScheme();
    const [outcomeName, setOutcomeName] = useState('');
    const [outcomeAmount, setOutcomeAmount] = useState('');
    const [outcomeList, setOutcomeList] = useState<{ outcomes: { outcomeName: string; outcomeAmount: string; id: number; }[]; }>({outcomes: []});
    const [total, setTotal] = useState(0)

    useEffect(() => {
        _retrieveData();
    }, []);

    useEffect(() => {
        calculateTotalAmount();
        _storeData();
    }, [outcomeList]);
    const handleOutcomeList = () => {
        if (!outcomeName || !outcomeAmount) return;
        const arr = {
            outcomeName: outcomeName,
            outcomeAmount: outcomeAmount,
            id: Math.random() * Math.floor(outcomeList.outcomes.length)
        };
        const list = {outcomes: [...outcomeList.outcomes, arr]}
        setOutcomeList(list)
        setOutcomeName('')
        setOutcomeAmount('')
    }
    const _storeData = async () => {
        try {
            const jsonValue = JSON.stringify(outcomeList);

            await AsyncStorage.setItem(
                '@Uoutcomes',
                jsonValue
            );
        } catch (error) {
            console.dir(error)
        }
    };

    const _retrieveData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@Uoutcomes');
            if (!jsonValue) return;
            setOutcomeList(JSON.parse(jsonValue))

        } catch (error) {
            console.dir(error)
        }
    };
    const handleDeleteOutcome = (id: number) => {
        /* comment */
        const list = outcomeList.outcomes.filter(item => item.id !== id)
        console.log(list);
        setOutcomeList({outcomes: list})
    }
    const calculateTotalAmount = () => {
        /* comment */
        let total = 0;
        outcomeList.outcomes.forEach((item) => {
            total += parseInt(item.outcomeAmount)
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
                      {text: "Sil", onPress: () => handleDeleteOutcome(item.id)}
                    ],
                    {cancelable: false}
                )}
            >
                <View style={styles.listView}>
                    <View style={styles.awesomeIcon}>
                        <FontAwesomeIconView name={"money-check-alt"} color={'#e14451'} sizeN={40}/>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                        backgroundColor: 'transparent'
                    }}>
                        <Text style={styles.listText}>{item.outcomeName}</Text>
                        <Text> = </Text>
                        <Text style={styles.listText}>{item.outcomeAmount} ₺</Text>
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
                               onChangeText={text => setOutcomeName(text)}
                               value={outcomeName}
                               clearTextOnFocus={false}
                               keyboardType={"default"}
                               placeholder={"Gider tanımı"}/>

                </View>
                <View style={styles.textInputView}>
                    <TextInput style={{height: '100%', paddingLeft: 8,color:`${theme === "light" ? '#000':'#fff'}`}}
                               onChangeText={text => setOutcomeAmount(text)}
                               value={outcomeAmount}
                               clearTextOnFocus={false}
                               keyboardType={"number-pad"}
                               placeholder={"Gider miktarı"}/>

                </View>
                <View style={{
                    backgroundColor: 'red',
                    width: 30,
                    height: 30,
                    margin: 5,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity onPress={handleOutcomeList}>
                        <IconView color="white" name="ios-add" sizeN={30}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <ScrollView>
                <View style={styles.draggableList}>

                    <DraggableFlatList
                        data={outcomeList.outcomes}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.id}`}
                        onDragEnd={({data}) => setOutcomeList({outcomes: data})}
                    />
                </View>
            </ScrollView>
            <View style={{backgroundColor: 'transparent', marginBottom: 5, marginHorizontal: 20}}>
                <LinearGradient
                    // Button Linear Gradient
                    colors={['#cd3d4a', 'rgba(205,68,81,0.66)']}
                    style={{padding: 15, justifyContent: 'center', flexDirection: 'row', borderRadius: 8,marginBottom:5}}>
                    <Text
                        style={{
                            backgroundColor: 'transparent',
                            fontSize: 24,
                            fontWeight: '700',
                            color: '#fff',
                        }}>
                        Toplam Gider =
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
        height: 40,
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
});
