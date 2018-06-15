import React, { Component } from "react";import { StyleSheet, Text, TouchableOpacity, View } from "react-native";class DrawerComponent extends Component {  render() {    let { activeItemKey } = this.props;    console.log("drawer navigator props", this.props.state);    return (      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>        <View style={{ height: 200 }}>          <TouchableOpacity            style={styles.item}            onPress={() => {              this.props.navigation.closeDrawer();              this.props.navigation.navigate("mapMain", { from: activeItemKey });            }}          >            <Text style={styles.itemText}>Map</Text>          </TouchableOpacity>          <TouchableOpacity            style={styles.item}            onPress={() => {              this.props.navigation.closeDrawer();              this.props.navigation.navigate("mapTest", { from: activeItemKey });            }}          >            <Text style={styles.itemText}>Map</Text>          </TouchableOpacity>          <TouchableOpacity onPress={() => this.props.navigation.navigate("review", { from: activeItemKey })}>            <Text style={styles.itemText}>Review</Text>          </TouchableOpacity>          <TouchableOpacity onPress={() => this.props.navigation.navigate("setting")}>            <Text style={styles.itemText}>Setting</Text>          </TouchableOpacity>        </View>      </View>    );  }}const styles = StyleSheet.create({  item: {    marginVertical: 20  },  itemText: {    fontSize: 24,    color: "white"  }});export default DrawerComponent;