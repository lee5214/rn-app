import React from "react";import { Text, View } from "react-native";const OrgDetailCallout = ({ detail }) => {  let {about,address,city,email,name,orgSpecies,orgType,orgurl,phone,zip}= detail  return (    <View style={styles.container}>      <Text style={styles.nameSection}>{name}</Text>      <Text>Location: {address} - {city} - {zip}</Text>      <Text>Call: {phone}</Text>    </View>  );};const styles={  container:{    flex:1,    borderRadius:10,    backgroundColor:'green'  },  nameSection:{    fontSize:15,    fontWeight:'bold',    textAlign:'center'  }}export default OrgDetailCallout;