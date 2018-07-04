import React, { Component } from "react";import { Dimensions, View } from "react-native";import OrgDetail from "../../components/Common/OrgDetail";import { connect } from "react-redux";import * as actions from "../../actions";const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");class ReviewDetail extends Component {  /*static navigationOptions = ({ navigation }) => ({   title: navigation.getParam("petObj").name,   titleFontSize: 30   });*/  render() {    //console.log(this.props.navigation.getParam("petID"));    //const id = this.props.navigation.getParam("petID");    //const petObj = this.props.navigation.getParam("petObj");    const orgID=this.props.navigation.state.params.orgID;    const orgObj = this.props.orgsDetailList.list[orgID]    return (      <View style={{ flex: 1}}>        <OrgDetail  orgID={this.props.navigation.state.params.orgID}/>      </View>    );  }}const mapStateToProps = state => {  return {    orgsDetailList: state.orgsDetailList  };};export default connect(mapStateToProps, actions)(ReviewDetail);