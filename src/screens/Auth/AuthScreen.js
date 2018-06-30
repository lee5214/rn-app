import React, { Component } from "react";//import { Container } from "native-base";import { View } from 'react-native';import { Button } from 'react-native-elements';import { connect } from "react-redux";import * as actions from "../../actions/index";import Icon from 'react-native-vector-icons/FontAwesome';class AuthScreen extends Component {  static navigationOptions = ({ navigation }) => ({    title: "Auth Page"  });  logout = async () => {    await this.props.facebookLogout();    this.props.navigation.navigate("welcome");  };  componentDidMount() {    //this.facebookAuth()    this.onAuthComplete(this.props);  }  componentDidUpdate(prevProps) {    this.onAuthComplete(this.props);  }  onAuthComplete(props) {    if (props.token) {      console.log('go to main')      this.props.navigation.navigate("mapWrapper");    }  }  facebookAuth = () => {    //this.props.navigation.navigate("main");    this.props.facebookLogin();  };  toSignupPage = () => {    this.props.navigation.navigate("signup");  };  render() {    return (      <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >        {/*<LoginForm          navigation={this.props.navigation}          toSignupPage={this.toSignupPage}          facebookAuth={this.facebookAuth}        />*/}        <Button          icon={<Icon name="facebook-square" size={24} color="black" />}          title={"Sign Up / Log In"}          titleStyle={{ color: "black", fontSize: 14, fontWeight: "600", paddingHorizontal: 20 }}          raised          buttonStyle={{backgroundColor:'white',width:200,height:50}}          onPress={this.facebookAuth}        />        {/*<Text>{this.props.token}</Text>*/}        {/*<Button*/}        {/*block*/}        {/*bordered*/}        {/*outline*/}        {/*style={{ marginTop: 20 }}*/}        {/*onPress={this.toSignUpPage()}*/}        {/*>*/}        {/*<Text>Sign Up</Text>*/}        {/*</Button>*/}      </View>    );  }}const styles = {  container: {    flex: 1,    flexDirection: "column",    justifyContent: "center"  }};function mapStateToProps(state) {  return { token: state.auth.token };}// function mapDispatchToProps(dispatch) {//   return bindActionCreators(actions, dispatch);// }AuthScreen.propTypes = {};export default connect(mapStateToProps, actions)(AuthScreen);