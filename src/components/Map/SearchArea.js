import React from "react";import { TouchableOpacity, View } from "react-native";import Icon2 from "react-native-vector-icons/FontAwesome";import { CheckBox } from "react-native-elements";const SearchArea = props => {  return (    <View      style={{        position: "absolute",        flexDirection: "row",        width: 150,        left: (props.leftOffset - 150) / 2,        height: 50,        top: props.topOffset - 50, //(SCREEN_HEIGHT - 50) / 2,        zIndex: 10,      }}    >      <View style={{ flex: 1 }}>        <CheckBox          size={20}          containerStyle={{ paddingRight: 0 }}          checkedIcon="dot-circle-o"          uncheckedIcon="circle-o"          uncheckedColor="white"          checkedColor="white"          onPress={props.setR10}          checked={props.radius === 10}        />      </View>      <TouchableOpacity        style={{          flex: 1,          backgroundColor: "white",          borderRadius: 25,          shadowColor: "black",          shadowOffset: {            width: 0,            height: 2          },          shadowRadius: 2,          shadowOpacity: 0.4        }}        onPress={props.onSearchArea}      >        <Icon2          color={'black'}          name="paw"          size={30}          style={{ margin: 10 }}          type="fontawesome"        />      </TouchableOpacity>      <View style={{ flex: 1 }}>        <CheckBox          size={30}          center          containerStyle={{ padding: 5, paddingLeft: 10 }}          checkedIcon="dot-circle-o"          uncheckedIcon="circle-o"          uncheckedColor="white"          checkedColor="white"          onPress={props.setR20}          checked={props.radius === 20}        />      </View>    </View>  );};export default SearchArea;