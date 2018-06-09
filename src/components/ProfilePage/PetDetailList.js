import React, { Component } from "react";import { Animated, Dimensions, Easing, StyleSheet, Text, View } from "react-native";const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");class PetDetailList extends Component {  state = {    focusedPetIndex: -1,    elementAnimated: new Animated.Value(0)  };  startElementBounce = Animated.timing(this.state.elementAnimated, {    toValue: 300,    easing: Easing.linear  });  componentDidUpdate(prevProps, prevState) {    if (this.props.flag !== prevProps.flag) {      this.startElementBounce.start(this.state.elementAnimated.setValue(0));    }  }  render() {    let { size, age, sex, color, mix, sizeCurrent, sizeUOM, breed, birthdate, adoptionFee, descriptionPlain, description, status } = this.props.petObj;    const fadeBounce = this.state.elementAnimated.interpolate({      inputRange: [0, 160, 180, 300],      outputRange: [1, 0, 0, 1]    });    const elementMoveLeft = this.state.elementAnimated.interpolate({      inputRange: [0, 140, 300],      outputRange: [0, -50, 0]    });    const elementMoveRight = this.state.elementAnimated.interpolate({      inputRange: [0, 140, 300],      outputRange: [0, 50, 0]    });    const elementMoveUp = this.state.elementAnimated.interpolate({      inputRange: [0, 140, 300],      outputRange: [0, -50, 0]    });    const elementMoveDown = this.state.elementAnimated.interpolate({      inputRange: [0, 140, 300],      outputRange: [0, 50, 0]    });    return (      <View style={{ flex: 1 }}>        <View style={styles.row}>          <View style={{ flex: 1 }} />          <View style={styles.eContainer}>            <Text style={styles.eKey}>Status </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateY: elementMoveUp }] }]}>{status || "N/A"}</Animated.Text>          </View>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Fee </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateX: elementMoveRight }] }]}>{adoptionFee || "N/A"}</Animated.Text>          </View>        </View>        <View style={styles.row}>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Age </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateX: elementMoveLeft }] }]}>{age || "N/A"}</Animated.Text>          </View>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Sex </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateY: elementMoveDown }] }]}>{sex}</Animated.Text>          </View>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Size </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateX: elementMoveRight }] }]}>{size || "N/A"}</Animated.Text>          </View>        </View>        <View style={styles.row}>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Breed</Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateY: elementMoveDown }] }]}>{breed || "N/A"}</Animated.Text>          </View>        </View>        <View style={styles.row}>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Birthday </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateX: elementMoveRight }] }]}>{birthdate || "N/A"}</Animated.Text>          </View>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Weight </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateY: elementMoveUp }] }]}>              {Number(sizeCurrent) > 0 && sizeUOM ? `${sizeCurrent} ${sizeUOM}` : "N/A"}            </Animated.Text>          </View>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Mix </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateX: elementMoveLeft }] }]}>{mix || "N/A"}</Animated.Text>          </View>        </View>        <View style={styles.row}>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Color </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateY: elementMoveDown }] }]}>{color || "N/A"}</Animated.Text>          </View>        </View>        <View style={styles.row}>          <View style={styles.eContainer}>            <Text style={styles.eKey}>Description </Text>            <Animated.Text style={[styles.eValue, { opacity: fadeBounce, transform: [{ translateY: elementMoveUp }] }]}>{descriptionPlain || "N/A"}</Animated.Text>          </View>        </View>      </View>    );  }}const styles = StyleSheet.create({  row: { flexDirection: "row", marginVertical: 20 },  eContainer: { flex: 1, overflow: "hidden" },  eKey: { color: "gray", fontSize: 12, fontWeight: "600", textAlign: "center" },  eValue: { color: "white", fontSize: 16, fontWeight: "600", textAlign: "center" },  description: { color: "white", fontSize: 14, fontWeight: "500", textAlign: "left" }});export default PetDetailList;