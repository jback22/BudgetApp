import * as React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

// @ts-ignore
import RNUrlPreview from 'react-native-url-preview';
import {Text, View} from '../components/Themed';
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {useState} from "react";
import {useEffect} from "react";
import DraggableFlatList from "react-native-draggable-flatlist";
import AsyncStorage from '@react-native-community/async-storage';
import useColorScheme from "../hooks/useColorScheme";


export default function TabThreeScreen() {
    const theme = useColorScheme()
    const [needName, setNeedName] = useState('');
    const [needAmount, setNeedAmount] = useState('');
    const [needUrl, setNeedUrl] = useState('');
    const [needList, setNeedList] = useState<{ needs: { needName: string; needAmount: string; needUrl: string; id: number; }[]; }>({needs: []});

    useEffect(() => {
        _retrieveData();
    }, []);
    useEffect(() => {
        _storeData();
    }, [needList]);
    const handleNeedList = () => {
        if (!needName || !needAmount) return;
        const arr = {needName: needName, needAmount: needAmount, id: needList.needs.length + 1, needUrl: needUrl};
        const list = {needs: [...needList.needs, arr]};
        setNeedList(list);
        setNeedName('');
        setNeedAmount('');
        setNeedUrl('');
    };
    const _storeData = async () => {
        try {
            const jsonValue = JSON.stringify(needList);

            await AsyncStorage.setItem(
                '@Uneeds',
                jsonValue
            );
        } catch (error) {
            console.dir(error)
        }
    };

    const _retrieveData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@Uneeds');
            if (!jsonValue) return;
            setNeedList(JSON.parse(jsonValue))

        } catch (error) {
            console.dir(error)
        }
    };
    const handleDeleteNeed = (id: number) => {
        /* comment */
        const list = needList.needs.filter(item => item.id !== id);
        console.log(list);
        setNeedList({needs: list})
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
                        {text: "Sil", onPress: () => handleDeleteNeed(item.id)}
                    ],
                    {cancelable: false}
                )}
            >
                <View style={styles.listView}>
                    <View style={styles.awesomeIcon}>
                        <IconView name={"ios-basket"} color={'#E8B927'} sizeN={40}/>
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginLeft: 20,
                        backgroundColor: 'transparent'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 10,
                            backgroundColor: 'transparent'
                        }}>
                            <Text style={styles.listText}>{item.needName}</Text>
                            <Text> = </Text>
                            <Text style={styles.listText}>{item.needAmount} ₺</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                            flexWrap: 'wrap',
                            marginLeft: 10,
                            backgroundColor: 'transparent'
                        }}>
                            <RNUrlPreview text={item.needUrl}/>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>

        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: 'transparent',
                marginHorizontal: 15,
                marginTop: 20,
                height: 150
            }}>
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: 'transparent'
                }}>
                    <View style={styles.textInputView}>
                        <TextInput
                            style={{height: '100%', paddingLeft: 8, color: `${theme === "light" ? '#000' : '#fff'}`}}
                            onChangeText={text => setNeedName(text)}
                            value={needName}
                            clearTextOnFocus={false}
                            keyboardType={"default"}
                            placeholder={"Alınacak tanımı"}/>

                    </View>
                    <View style={styles.textInputView}>
                        <TextInput
                            style={{height: '100%', paddingLeft: 8, color: `${theme === "light" ? '#000' : '#fff'}`}}
                            onChangeText={text => setNeedAmount(text)}
                            value={needAmount}
                            clearTextOnFocus={false}
                            keyboardType={"number-pad"}
                            placeholder={"Fiyatı"}/>

                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: 'transparent'
                }}>
                    <View style={styles.textInputView}>
                        <TextInput
                            style={{height: '100%', paddingLeft: 8, color: `${theme === "light" ? '#000' : '#fff'}`}}
                            onChangeText={text => setNeedUrl(text)}
                            value={needUrl}
                            clearTextOnFocus={false}
                            keyboardType={"url"}
                            placeholder={"Link'i yapıştır"}/>

                    </View>
                </View>
                <View style={{
                    backgroundColor: '#F9C900',
                    width: 30,
                    height: 30,
                    margin: 5,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity onPress={handleNeedList}>
                        <IconView color="white" name="ios-add" sizeN={30}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <ScrollView>
                <View style={styles.draggableList}>

                    <DraggableFlatList
                        data={needList.needs}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.id}`}
                        onDragEnd={({data}) => setNeedList({needs: data})}
                    />
                </View>
            </ScrollView>
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
        flex: 1
    },
    textInputView: {
        flex: 1,
        margin: 5,
        backgroundColor: 'rgba(209,209,209,0.32)',
        borderRadius: 6,
        padding: 5,
        height: 40
    },
    listView: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'rgba(227,227,227,0.33)',
        marginVertical: 4,
        borderRadius: 8,
        alignItems: 'center',
        padding: 5,
        paddingLeft: 10
    },
    listText: {
        fontSize: 18,
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
