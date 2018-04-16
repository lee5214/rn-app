import React, { Component } from "react";import PropTypes from "prop-types";import { Animated, Dimensions, LayoutAnimation, PanResponder, UIManager, View } from "react-native";const SCREEN_WIDTH = Dimensions.get("window").width;const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;const SWIPE_OUT_DURATION = 150; // msclass Swipe extends Component {  constructor(props) {    super(props);    this.state = {      index: 0    };    this.position = new Animated.ValueXY();    this.panResponder = PanResponder.create({      onStartShouldSetPanResponder: () => true,      onPanResponderMove: Animated.event([        null,        {          dx: this.position.x,          dy: this.position.y        }      ]),      onPanResponderRelease: (event, gestureState) => {        if (gestureState.dx > SWIPE_THRESHOLD) {          this.forceSwipe("right");          console.log("like it!");        } else if (gestureState.dx < -SWIPE_THRESHOLD) {          this.forceSwipe("left");          console.log("hate it...");        } else {          this.resetPosition();        }      }    });  }  componentWillUpdate() {    UIManager.setLayoutAnimationEnabledExperimental &&      UIManager.setLayoutAnimationEnabledExperimental(true);    LayoutAnimation.spring();  }  getCardStyle = () => {    const rotate = this.position.x.interpolate({      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],      outputRange: ["-120deg", "0deg", "120deg"]    });    return {      ...this.position.getLayout(),      transform: [{ rotate }] // overwrite properity    };  };  resetPosition = () => {    Animated.spring(this.position, { toValue: 0 }).start();  };  forceSwipe = direction => {    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;    Animated.timing(this.position, {      // timing: linear feel with duration, spring is bouncing feel      toValue: { x, y: 0 },      duration: SWIPE_OUT_DURATION    }).start(() => {      this.onSwipeComplete(direction);    }); // this callback only active after the previous animation finished  };  onSwipeComplete = direction => {    const { onSwipeLeft, onSwipeRight, data } = this.props;    const obj = data[this.state.index];    direction === "right" ? onSwipeRight(obj) : onSwipeLeft(obj);    this.setState({ index: ++this.state.index });    this.position.setValue(0, 0);  };  renderDeckCards = data => {    return data      .map((item, itemIndex) => {        // viewed cards        if (itemIndex < this.state.index) {          return null;        }        // current card        if (itemIndex === this.state.index) {          return (            <Animated.View              key={item[this.props.keyProp]}              {...this.panResponder.panHandlers}              style={[                this.getCardStyle(),                styles.cardStyle,                styles.topCardStyle              ]}            >              {this.props.renderCard(item)}            </Animated.View>          );        }        // un-viewed cards        return (          <Animated.View            key={item[this.props.keyProp]}            style={[              styles.cardStyle,              {                top: 150 * (itemIndex - this.state.index),                left: 0,                right: 0,                // left: 1 * (itemIndex - this.state.index),                // right: 1 * (itemIndex - this.state.index),                zIndex: -itemIndex              }            ]}          >            {this.props.renderCard(item)}          </Animated.View>        );      })      .reverse(); // so that #0 will be the first on top  };  render() {    console.log(this.props.data.length);    return (      <View>        <View>{this.renderDeckCards(this.props.data)}</View>      </View>    );  }}const styles = {  cardStyle: {    height: 800,    position: "absolute",    overflow: "hidden"  },  topCardStyle: {    width: SCREEN_WIDTH  }};Swipe.propTypes = {  data: PropTypes.array.isRequired,  renderCard: PropTypes.func.isRequired,  onSwipeLeft: PropTypes.func.isRequired,  onSwipeRight: PropTypes.func.isRequired,  keyProp: PropTypes.string.isRequired // the id's key in returned json for each card};Swipe.defaultProps = {  onSwipeLeft: () => {},  onSwipeRight: () => {},  keyProp: "id"};export default Swipe;