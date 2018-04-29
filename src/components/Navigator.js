import React from "react";import { StackNavigator, TabNavigator } from "react-navigation";import ReviewScreen from "../screens/ReviewScreen";import DeckScreen from "../screens/DeckScreen";import SettingScreen from "../screens/SettingScreen";import AuthScreen from "../screens/AuthScreen";import MapScreen from "../screens/MapScreen";import WelcomeScreen from "../screens/WelcomeScreen";import SignupScreen from "../screens/SignupScreen";const ReviewNavigator = StackNavigator({  review: { screen: ReviewScreen },  setting: { screen: SettingScreen }});const AuthNavigator = StackNavigator({  auth: { screen: AuthScreen },  signup: { screen: SignupScreen }});const MainNavigator = TabNavigator(  {    map: { screen: MapScreen },    deck: { screen: DeckScreen },    review: ReviewNavigator  },  {    tabBarOptions: {      labelStyle: { fontSize: 10 },      activeTintColor: "tomato",      inactiveTintColor: "gray"    }  });export default TabNavigator(  {    welcome: { screen: WelcomeScreen },    auth: { screen: AuthNavigator },    main: {      screen: MainNavigator,      tabBarOptions: {        labelStyle: { fontSize: 14 }      }    }  },  {    navigationOptions: {      tabBarVisible: false    },    lazy: true  });