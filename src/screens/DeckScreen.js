import React, { Component } from "react";import { connect } from "react-redux";import { View } from "react-native";class DeckScreen extends Component {  render() {    return (      <View>      </View>    );  }}const mapStateToProps = state => {  return {jobsList : state.jobsList.results};};DeckScreen.propTypes = {};export default connect (mapStateToProps, null) (DeckScreen);