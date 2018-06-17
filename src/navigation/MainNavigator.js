import React from "react";import { Dimensions } from "react-native";import { createBottomTabNavigator, createDrawerNavigator, createStackNavigator } from "react-navigation";import ReviewScreen from "../screens/Review/ReviewScreen";import ReviewDetail from "../screens/Review/ReviewDetail";import DeckScreen from "../screens/DeckScreen";import SettingScreen from "../screens/SettingScreen";import AuthScreen from "../screens/AuthScreen";import MapScreen from "../screens/Map/MapScreen";import WelcomeScreen from "../screens/WelcomeScreen";import SignupScreen from "../screens/SignupScreen";import DrawerComponent from "../components/Common/DrawerComponent";import ProfileScreen from "../screens/Profile/Profile";import ReviewWrapper from "../screens/Review/ReviewWrapper";const { width: SCREEN_WIDTH } = Dimensions.get("window");const AuthNavigator = createStackNavigator({  auth: { screen: AuthScreen },  signup: { screen: SignupScreen }});const ReviewNavigator = createStackNavigator(  {    review: { screen: ReviewScreen },    review_detail: { screen: ReviewDetail },    setting: { screen: SettingScreen }  },  {    //headerMode:'screen',    swipeEnabled: false,    navigationOptions: {      drawerLockMode: "locked-open"    }  });const MapNavigator = createDrawerNavigator(  {    mapMain: { screen: MapScreen },    mapTest: { screen: ReviewWrapper }    //review: ReviewNavigator    /*review: createStackNavigator({      review: { screen: props=><ReviewScreen{...props}/>},      //review_detail: { screen: ReviewDetail },      //setting: { screen: SettingScreen }    })*/  },  {    swipeEnabled: false,    drawerPosition: "left",    drawerWidth: SCREEN_WIDTH,    drawerOpenRoute: "DrawerOpen",    drawerCloseRoute: "DrawerClose",    drawerToggleRoute: "DrawerToggle",    drawerBackgroundColor: "transparent",    contentComponent: props => <DrawerComponent {...props} />  });const MainNavigator = createBottomTabNavigator(  {    map: MapNavigator,    deck: { screen: DeckScreen },    review: ReviewNavigator,    profile: { screen: ProfileScreen },    mapTest: { screen: ReviewWrapper }    //test: { screen: TestScreen }  },  {    swipeEnabled: false,    tabBarOptions: {      //showLabel:false,      labelStyle: { fontSize: 10 },      activeTintColor: "tomato",      inactiveTintColor: "white",      style: { backgroundColor: "black" }    },    navigationOptions: {      tabBarVisible: false    }  });const AppNavigator = createBottomTabNavigator(  {    welcome: { screen: WelcomeScreen },    auth: { screen: AuthNavigator },    main: {      screen: MainNavigator      /*tabBarOptions: {        labelStyle: { fontSize: 14 }      }*/    }  },  {    navigationOptions: {      tabBarVisible: false    },    lazy: true  });export default AppNavigator;