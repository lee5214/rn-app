import React, { Component } from "react";import { connect } from "react-redux";import { Animated, Dimensions, Easing, ScrollView, StyleSheet, Text, View } from "react-native";import * as actions from "../../actions";import { orgDetailFieldList } from "../../../config/setting/defaultValues";const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");const SCREEN_RADIO = SCREEN_HEIGHT / SCREEN_WIDTH;class PetDetailList extends Component {  state = {    focusedPetIndex: -1,    elementAnimated: new Animated.Value(0),    isLiked: false,    isViewerOn: false  };  startElementBounce = Animated.timing(this.state.elementAnimated, {    toValue: 300,    easing: Easing.linear  });  componentDidUpdate(prevProps, prevState) {    if (this.props.flag !== prevProps.flag) {      this.startElementBounce.start(this.state.elementAnimated.setValue(0));    }  }  _renderBlock = arr => {    if (arr.length) {      return arr.map(item => <View>{item.key}</View>);    }  };  OrgList = () => {    const orgObj = this.props.orgsDetailList.list[this.props.orgID];    console.log("orgObj", orgObj);    return orgDetailFieldList.map(      elePair =>        orgObj[elePair[0]] &&        orgObj[elePair[0]] !== "" && (          <View style={styles.row}>            <View style={[styles.eContainer]}>              <Text style={[styles.eKey]}>{elePair[1].toUpperCase()} </Text>              <Text style={[styles.eValue]}>{orgObj[elePair[0]] || "N/A"}</Text>            </View>          </View>        )    );  };  render() {    return (      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>        <View          style={{            shadowColor: "black",            shadowOffset: { height: 0, width: 0 },            shadowOpacity: 0.2,            shadowRadius: 10,            position: "absolute",            flex: 1,            backgroundColor: "white",            height: SCREEN_HEIGHT,            width: SCREEN_WIDTH * 0.9,            left: SCREEN_WIDTH * 0.05          }}        />        <Text style={{ fontSize: 50, fontWeight: "700", alignSelf: "flex-start" }}>ORG DETAIL</Text>        {this.props.orgsDetailList.list[this.props.orgID] ? (          <ScrollView style={{ flex: 1, flexDirection: "column", backgroundColor: "transparent", marginBottom: 5 }}>            <View style={{ position: "absolute", height: "100%" }} />            <View style={{ flex: 1, flexDirection: "row", width: SCREEN_WIDTH * 0.9 }} />            <View style={{ flex: 1, width: SCREEN_WIDTH * 0.9 }}>              <this.OrgList />            </View>          </ScrollView>        ) : (          <Text>not found</Text>        )}      </View>    );  }}const styles = StyleSheet.create({  row: { flexDirection: "row", marginVertical: 10, justifyContent: "space-between" },  eContainer: {    flex: 1,    flexDirection: "column",    //overflow: "hidden",    marginHorizontal: 10,    paddingVertical: 10,    borderRadius: 5,    borderBottomWidth: 1,    borderBottomColor: "#696969"    //backgroundColor:'red',  },  eKey: { flex: 1, color: "#a5a5a5", fontSize: 14, fontWeight: "700", textAlign: "left", marginBottom: 10 },  eValue: { flex: 1, color: "#565656", fontSize: 13, fontWeight: "600", textAlign: "left", marginRight: 0 },  description: { color: "white", fontSize: 12, fontWeight: "500", textAlign: "left" }});const mapStateToProps = state => {  return {    orgsDetailList: state.orgsDetailList  };};export default connect(mapStateToProps, actions)(PetDetailList);