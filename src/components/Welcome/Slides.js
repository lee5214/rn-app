import React, { Component } from "react";import { Dimensions, ScrollView, Text, View } from "react-native";import { Button } from "react-native-elements";import Check from "../../components/Animation/Check2";import Dog from "../../components/Animation/Dog";const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT}= Dimensions.get("window");class Slides extends Component {  state={    scrollStart:false  }  renderSlides = () => {    const { data } = this.props;    return data.map((slide, i) => {      return (        <View key={slide.text} style={[styles.slide, { backgroundColor: slide.bgColor }]}>          <View            style={{              alignItems: "center",              justifyContent: "center",              width: SCREEN_WIDTH,              flex: 1            }}          >            {!this.state.scrollStart&&<Check />}          </View>          <View            style={{              justifyContent: "flex-start",              alignItems: "center",              width: SCREEN_WIDTH,              flex: 1            }}          >            <Text style={styles.text}>{slide.text}</Text>            {i === data.length - 1 ? (              <Button                title={" Go "}                titleStyle={{ color: "gray" }}                raised                buttonStyle={styles.welcomeButton}                onPress={this.props.onWelcomeSlidesComplete}              />            ) : null}          </View>        </View>      );    });  };  render() {    return (      <ScrollView        horizontal        pagingEnabled        showsHorizontalScrollIndicator        onScroll={() => {          this.setState({ scrollStart: true });        }}        onMomentumScrollEnd={          () => {            console.log("scroll");            this.setState({ scrollStart: false });          }        }        /*onScrollEndDrag={() => {          console.log("scroll");          this.setState({ scrollStart: false });        }}*/      >        {/*{this.renderSlides()}*/}        <View style={[styles.slide, { backgroundColor: '#F44336' }]}>          <View            style={{              alignItems: "center",              justifyContent: "center",              width: SCREEN_WIDTH,              flex: 3            }}          >            {!this.state.scrollStart&&<Check />}          </View>          <View            style={{              justifyContent: "flex-start",              alignItems: "center",              width: SCREEN_WIDTH*.8,              flex: 1            }}          >            <Text style={styles.text}>Are you a pet person?</Text>          </View>        </View>        <View style={[styles.slide]}>          <View            style={{              alignItems: "center",              justifyContent: "center",              width: SCREEN_WIDTH,              flex: 3            }}          >            {!this.state.scrollStart&&<Dog />}          </View>          <View            style={{              justifyContent: "flex-start",              alignItems: "center",              width: SCREEN_WIDTH,              flex: 1            }}          >            <Text style={styles.text}>Right?</Text>          </View>        </View>      </ScrollView>    );  }}const styles = {  slide: {    width: SCREEN_WIDTH,    height: SCREEN_HEIGHT,    flex: 1,    justifyContent: "center",    alignItems: "center"  },  text: {    fontSize: 20,    textAlign: "left",    color: "white"  },  welcomeButton: {    backgroundColor: "white",    marginTop: 30  },  welcomeButtonText: {    color: "black"  }};export default Slides;