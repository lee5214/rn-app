import React from "react";import { Modal, View } from "react-native";import { Button } from "react-native-elements";import Check from "../Animation/Check2";const ModalContainer = ({ visible, setLoadingFalse }) => {  return (    <Modal transparent={true} visible={visible} onPress={setLoadingFalse}>      <View style={styles.modal}>        {/*<ActivityIndicator*/}        {/*style={styles.spinner}*/}        {/*size={"large"}*/}        {/*animating={true}*/}        {/*hidesWhenStopped={true}*/}        {/*/>*/}        <Check style={styles.lottieContainer}/>        <Button style={styles.cancelButton}          title={"cancel"}          backgroundColor={"#009688"}          onPress={setLoadingFalse}        />      </View>    </Modal>  );};const styles = {  modal: {    width: '100%',    height: '100%',    justifyContent: "center",    alignSelf:'center',    backgroundColor: "white",    opacity:.8  },  lottieContainer: {    flex:1,    height: 200,    width: 200,    backgroundColor: "red"  },  cancelButton:{  }};export default ModalContainer;