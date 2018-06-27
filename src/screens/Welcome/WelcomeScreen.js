import React, { Component } from "react";import { AsyncStorage, View } from "react-native";import { AppLoading } from "expo";import Slides from "../../components/Welcome/Slides";import SLIDE_DATA from "../../assets/welcomeData";// const SLIDE_DATA = [//   { text: "aha wow this is nice", bgColor: "red" },//   { text: "or no....", bgColor: "green" },//   { text: "Im kidding!, go try it first asdas\n asd sa 吧咔咔 啊喽哈", bgColor: "pink" }// ];class WelcomeScreen extends Component {  state = {    token : null,  };  onWelcomeSlidesComplete = () => {    this.props.navigation.navigate ("auth");  };  async componentDidMount () {    let token = await AsyncStorage.getItem ("fb_token");    if (token) {      this.setState ({token});      this.props.navigation.navigate ('map');    } else {      this.setState ({token : false});    }  }  render() {    if (this.state.token === null) {      return <AppLoading/>;    }    return (      <View style={styles.container}>        <Slides          data={ SLIDE_DATA }          onWelcomeSlidesComplete={ this.onWelcomeSlidesComplete }        />      </View>    );  }}const styles = {  container : {    flex : 1,  },};WelcomeScreen.propTypes = {};export default WelcomeScreen;