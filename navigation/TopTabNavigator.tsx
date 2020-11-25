import { Ionicons } from "@expo/vector-icons";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationProp,
} from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { Text, View } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import {
  BottomTabParamList,
  TabOneParamList,
  TabThreeParamList,
  TabTwoParamList,
} from "../types";
import TabThreeScreen from "../screens/TabThreeScreen";

const TopTab = createMaterialTopTabNavigator();

export default function TopTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <TopTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{
        indicatorStyle: { backgroundColor: Colors[colorScheme].tintActive },
        activeTintColor: Colors[colorScheme].tintActive,
        inactiveTintColor: Colors[colorScheme].tint,
        showIcon: true,
      }}
    >
      <TopTab.Screen
        name="TabOne"
        component={TabOneNavigator}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{ color: `${focused ? "#00CD00" : "#7F7F7F"}` }}>
              Gelirler
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="md-trending-up"
              color={`${focused ? "#00CD00" : "#7F7F7F"}`}
            />
          ),
        }}
      />
      <TopTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{ color: `${focused ? "red" : "#7F7F7F"}` }}>
              Giderler
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="md-trending-down"
              color={`${focused ? "red" : "#7F7F7F"}`}
            />
          ),
        }}
      />
      <TopTab.Screen
        name="TabThree"
        component={TabThreeNavigator}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{ color: `${focused ? "#F9C900" : "#7F7F7F"}` }}>
              Alınacaklar
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="ios-basket"
              color={`${focused ? "#F9C900" : "#7F7F7F"}`}
            />
          ),
        }}
      />
    </TopTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={20} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ headerTitle: "Tab One Title" }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: "Tab Two Title" }}
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
        options={{ headerTitle: "Tab Three Title" }}
      />
    </TabThreeStack.Navigator>
  );
}
