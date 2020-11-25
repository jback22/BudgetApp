import * as React from "react";
import {Text, View} from "react-native";
import {
    createMaterialBottomTabNavigator,
    MaterialBottomTabNavigationProp,
} from "@react-navigation/material-bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import TabThreeScreen from "../screens/TabThreeScreen";
import {
    BottomTabParamList,
    TabOneParamList,
    TabThreeParamList,
    TabTwoParamList,
    HomeScreenParamList, AddIncomeScreenParamList, AddOutcomeScreenParamList,
} from "../types";
import {HeaderBackButton} from "@react-navigation/stack";
import {Ionicons, AntDesign, FontAwesome5} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import {white} from "react-native-paper/lib/typescript/src/styles/colors";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import AddIncomeScreen from "../screens/AddIncomeScreen";
import AddOutcomeScreen from "../screens/AddOutcomeScreen";
import {useTranslation} from "react-i18next";

const BottomTab = createMaterialBottomTabNavigator();

const BottomTabNavigator: React.FC = (props) => {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();

    useEffect(() => {
        //yy()
        xx()
    }, [])
    const xx = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@Uincomes");
            if (!jsonValue) return;
            console.log(jsonValue);
        } catch (error) {
            console.dir(error);
        }
    }
    const yy = async () => {
        try {
            await AsyncStorage.clear()
        } catch (error) {
            console.dir(error);
        }
    }
    return (
        <BottomTab.Navigator
            initialRouteName="Wallet"
            // @ts-ignore
            tabBarOptions={{
                indicatorStyle: {backgroundColor: Colors[colorScheme].tintActive},
                activeTintColor: Colors[colorScheme].tintActive,
                inactiveTintColor: Colors[colorScheme].tint,
                showIcon: true,
                showLabel: false,
            }}
            barStyle={{
                backgroundColor: Colors[colorScheme].background,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                padding: 5,
            }}
            labeled={false}
        >
            <BottomTab.Screen
                name="Wallet"
                component={HomeScreenNavigator}
                options={{
                    tabBarIcon: ({color, focused}) => (
                        <View style={{width: 50, height: 50, bottom: 10}}>
                            <FontAwesome5 name="wallet" size={35} color={color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                name="Incomes"
                component={TabOneNavigator}
                options={{
                    tabBarLabel: t('Incomes'),
                    tabBarIcon: ({color, focused}) => (
                        <View style={{width: 50, height: 50, bottom: 10}}>
                            <AntDesign
                                name="arrowup"
                                size={35}
                                color={focused ? "#3FAC4D" : color}
                            />
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                name="Outcomes"
                component={TabTwoNavigator}
                options={{
                    tabBarLabel: t('Outcomes'),
                    tabBarIcon: ({color, focused}) => (
                        <View style={{width: 50, height: 50, bottom: 10}}>
                            <AntDesign
                                name="arrowdown"
                                size={35}
                                color={focused ? "#FF1919" : color}
                            />
                        </View>
                    ),
                }}
            />
            {/* <BottomTab.Screen
        name="TabThree"
        component={TabThreeNavigator}
        options={{
          tabBarLabel: "Alınacaklar",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                bottom: 15,
                borderRadius: 8,
                backgroundColor: "#E50000",
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TabBarIcon name="md-add" color={"white"} />
            </View>
          ),
        }}
      /> */}
        </BottomTab.Navigator>
    );
};
// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
    return <Ionicons size={35} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const HomeScreenStack = createStackNavigator<HomeScreenParamList>();

function HomeScreenNavigator() {
    const { t } = useTranslation();
    return (
        <HomeScreenStack.Navigator>
            <HomeScreenStack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerTitle: t('Wallet') ,
                }}
            />
        </HomeScreenStack.Navigator>
    );
}

const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    return (
        <TabOneStack.Navigator>
            <TabOneStack.Screen
                name="TabOneScreen"
                component={TabOneScreen}
                options={{
                    headerTitle: t('Incomes'),
                    headerLeft: (props) => (
                        <HeaderBackButton
                            {...props}
                            labelStyle={{fontSize: 14}}
                            onPress={() => {
                                // Do something
                                navigation.goBack();
                            }}
                        />
                    ),
                }}
            />
            <TabOneStack.Screen
                name="AddIncomeScreen"
                component={AddIncomeScreenNavigator}
                options={{headerTitle: t('Incomes')}}
            />

        </TabOneStack.Navigator>
    );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    return (
        <TabTwoStack.Navigator>
            <TabTwoStack.Screen
                name="TabTwoScreen"
                component={TabTwoScreen}
                options={{
                    headerTitle: t('Outcomes'),
                    headerLeft: (props) => (
                        <HeaderBackButton
                            {...props}
                            labelStyle={{fontSize: 14}}
                            onPress={() => {
                                // Do something
                                navigation.goBack();
                            }}
                        />
                    ),
                }}
            />
            <TabTwoStack.Screen
                name="AddOutcomeScreen"
                component={AddOutcomeScreenNavigator}
                options={{headerTitle: t('Outcomes')}}
            />
        </TabTwoStack.Navigator>
    );
}

const TabThreeStack = createStackNavigator<TabThreeParamList>();

function TabThreeNavigator() {
    return (
        <TabThreeStack.Navigator>
            <TabThreeStack.Screen
                name="TabThreeScreen"
                component={TabThreeScreen}
                options={{headerTitle: "Alınacaklar"}}
            />
        </TabThreeStack.Navigator>
    );
}

const AddIncomeScreenStack = createStackNavigator<AddIncomeScreenParamList>();

function AddIncomeScreenNavigator() {
    return (
        <AddIncomeScreenStack.Navigator>
            <AddIncomeScreenStack.Screen
                name="AddIncomeScreen"
                options={{headerTitle: "Add"}}
            >

                {props => < AddIncomeScreen/>}
            </AddIncomeScreenStack.Screen>
        </AddIncomeScreenStack.Navigator>
    );
}

const AddOutcomeScreenStack = createStackNavigator<AddOutcomeScreenParamList>();

function AddOutcomeScreenNavigator() {
    return (
        <AddOutcomeScreenStack.Navigator>
            <AddOutcomeScreenStack.Screen
                name="AddOutcomeScreen"
                options={{headerTitle: "Add"}}
            >

                {props => < AddOutcomeScreen/>}
            </AddOutcomeScreenStack.Screen>
        </AddOutcomeScreenStack.Navigator>
    );
}

export default BottomTabNavigator;
