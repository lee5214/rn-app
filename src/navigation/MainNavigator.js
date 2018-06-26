import React from "react";import { Dimensions } from "react-native";import { createBottomTabNavigator, createDrawerNavigator, createStackNavigator } from "react-navigation";import ReviewScreen from "../screens/Review/ReviewScreen";import ReviewDetail from "../screens/Review/ReviewDetail";import DeckScreen from "../screens/DeckScreen";import SettingScreen from "../screens/SettingScreen";import AuthScreen from "../screens/AuthScreen";import WelcomeScreen from "../screens/WelcomeScreen";import SignupScreen from "../screens/SignupScreen";import ProfileScreen from "../screens/Profile/ProfileScreen";import DrawerComponent from "../components/Common/DrawerComponent";import MapWrapper from "../screens/Map/MapWrapper";import ProfileWrapper from "../screens/Profile/ProfileWrapper";import ReviewWrapper from "../screens/Review/ReviewWrapper";const { width: SCREEN_WIDTH } = Dimensions.get("window");const AuthNavigator = createStackNavigator({  auth: { screen: AuthScreen },  signup: { screen: SignupScreen }});const ReviewNavigator = createStackNavigator(  {    review: { screen: ReviewScreen },    review_detail: { screen: ReviewDetail },  },  {    //headerMode:'screen',    swipeEnabled: false,    navigationOptions: {      drawerLockMode: "locked-open"    }  });const ProfileNavigator = createStackNavigator(  {    profile: {screen:ProfileScreen},    setting:{screen:SettingScreen}  },  {    //headerMode:'screen',    swipeEnabled: false,    navigationOptions: {      drawerLockMode: "locked-open"    }  })const MainNavigator = createDrawerNavigator(  {    mapWrapper:  MapWrapper ,    reviewWrapper: ReviewWrapper,    profileWrapper: props =><ProfileWrapper {...props}/>,    setting:SettingScreen    //review: ReviewNavigator    /*review: createStackNavigator({      review: { screen: props=><ReviewScreen{...props}/>},      //review_detail: { screen: ReviewDetail },      //setting: { screen: SettingScreen }    })*/  },  {    swipeEnabled: false,    drawerPosition: "left",    drawerWidth: SCREEN_WIDTH,    drawerOpenRoute: "DrawerOpen",    drawerCloseRoute: "DrawerClose",    drawerToggleRoute: "DrawerToggle",    drawerBackgroundColor: "transparent",    contentComponent: props => <DrawerComponent {...props} />  });/*const MainNavigator = createBottomTabNavigator(  {    map: MapNavigator,    deck: { screen: DeckScreen },    review: ReviewNavigator,    profile: ProfileNavigator,    mapTest: { screen: ReviewWrapper }    //test: { screen: TestScreen }  },  {    swipeEnabled: false,    tabBarOptions: {      //showLabel:false,      labelStyle: { fontSize: 10 },      activeTintColor: "tomato",      inactiveTintColor: "white",      style: { backgroundColor: "black" }    },    navigationOptions: {      tabBarVisible: false    }  });*/const AppNavigator = createBottomTabNavigator(  {    welcome: { screen: WelcomeScreen },    auth: { screen: AuthNavigator },    main: {      screen: MainNavigator      /*tabBarOptions: {        labelStyle: { fontSize: 14 }      }*/    }  },  {    navigationOptions: {      tabBarVisible: false    },    lazy: true  });export default AppNavigator;