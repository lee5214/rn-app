import React, { Component } from "react";import { Animated, Dimensions, Easing, View } from "react-native";import { createStackNavigator } from "react-navigation";//import ExploreForm from "../Test-Ani2";import ExploreForm from "./ExploreForm";import ExplorePetDetail from "./ExplorePetDetail";import ExploreOrgDetail from "./ExploreOrgDetail";import ExplorePetsList from "./ExplorePetsList";import Icon from "react-native-vector-icons/MaterialIcons";import _ from "lodash";const { width: SCREEN_WIDTH } = Dimensions.get("window");class ExploreWrapper extends Component {  constructor(props) {    super(props);    this.state = {      drawerOpen: false,      anime_drawerOpen: new Animated.Value(0)    };    this.anime_drawerOpen = Animated.timing(this.state.anime_drawerOpen, {      toValue: 300,      duration: 300,      easing: Easing.linear    });    this.anime_drawerOpen2 = Animated.timing(this.state.anime_drawerOpen, {      toValue: 0,      duration: 300,      easing: Easing.linear    });  }  static navigationOptions = {    drawerLockMode: "locked-closed",    header: null  };  static getDerivedStateFromProps(props, state) {    if (_.get(props, "navigation.state.params.from") === "exploreWrapper") {      console.log("drawer close anime");      return { drawerOpen: false };    }    return null;  }  componentDidUpdate(prevProps, prevState) {    if (this.state.drawerOpen === true && this.state.drawerOpen !== prevState.drawerOpen) {      this.props.navigation.openDrawer();      this.anime_drawerOpen.start(this.state.anime_drawerOpen.setValue(0));    }    if (this.state.drawerOpen === false && this.state.drawerOpen !== prevState.drawerOpen) {      this.props.navigation.closeDrawer();      this.anime_drawerOpen2.start(this.state.anime_drawerOpen.setValue(300));    }  }  render() {    const Explore = createStackNavigator({      exploreScreen: {        screen: ExploreForm,        navigationOptions: {          drawerLockMode: "locked-open",          headerLeft: (            <Icon              name="menu"              size={30}              type="materialicons"              style={{ paddingLeft: 20 }}              onPress={() => {                this.setState({ drawerOpen: true });                this.props.navigation.openDrawer();              }}            />          ),          tabBarIcon: ({ tintColor }) => {            return <Icon name="favorite-border" color={tintColor} size={20} type="materialicons" />;          }        }      },      exploreForm: {screen: ExploreForm},      explorePetDetail: { screen: ExplorePetDetail },      exploreOrgDetail: { screen: ExploreOrgDetail },      explorePetsList: { screen: ExplorePetsList },    });    const drawerScale = this.state.anime_drawerOpen.interpolate({      inputRange: [0, 300],      outputRange: [1, 0.7],      extrapolate: "clamp"    });    const drawerLeft = this.state.anime_drawerOpen.interpolate({      inputRange: [0, 300],      outputRange: [0, SCREEN_WIDTH * 0.7],      extrapolate: "clamp"    });    return (      <Animated.View style={{ overflow: "hidden", flex: 1, transform: [{ scale: drawerScale }, { translateX: drawerLeft }] }}>        <View style={{ flex: 4, backgroundColor: "lightgreen" }}>          <Explore />        </View>      </Animated.View>    );  }}export default ExploreWrapper;