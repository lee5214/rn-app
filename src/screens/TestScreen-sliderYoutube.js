import React, { Component } from "react";import { Animated, Dimensions, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";import { Video } from "expo";import { FontAwesome as Icon } from "@expo/vector-icons"; // 6.3.1const Lights = { uri: "https://player.vimeo.com/external/207277102.hd.mp4?s=6939b93ae3554679b57f5e7fa831eef712a74b3c&profile_id=119&oauth2_token_id=57447761" }const Thumbnail = { uri: "http://i.imgur.com/HKVgAl0.jpg" }const ChannelIcon = { uri: "http://i.imgur.com/PsM60Ky.png" }const TouchableIcon = ({ name, children }) => {  return (    <TouchableOpacity style={styles.touchIcon}>      <Icon name={name} size={30} color="#767577" />      <Text style={styles.iconText}>        {children}      </Text>    </TouchableOpacity>  );};const PlaylistVideo = ({ name, channel, views, image }) => {  return (    <View style={styles.playlistVideo}>      <Image source={image} style={styles.playlistThumbnail} resizeMode="cover" />      <View style={styles.playlistText}>        <Text style={styles.playlistVideoTitle}>          {name}        </Text>        <Text style={styles.playlistSubText}>          {channel}        </Text>        <Text style={styles.playlistSubText}>          {views} views        </Text>      </View>    </View>  );};export default class rnvideo extends Component {  componentWillMount() {    this._animation = new Animated.Value(0);    this._panResponder = PanResponder.create({      onStartShouldSetPanResponder: () => true,      onMoveShouldSetPanResponder: () => true,      onPanResponderMove: Animated.event([        null,        {          dy: this._animation,        },      ]),      onPanResponderRelease: (e, gestureState) => {        if (gestureState.dy > 100) {          Animated.spring(this._animation, {            toValue: 300,            tension:1,            duration: 200,          }).start();          this._animation.setOffset(300);        } else {          Animated.spring(this._animation, {            toValue: 0,            tension:1,            duration: 200,          }).start();          this._animation.setOffset(0);        }      },    });  }  handleOpen = () => {    this._animation.setOffset(0);    Animated.timing(this._animation, {      toValue: 0,      duration: 200,    }).start();  }  render() {    const { width, height: screenHeight } = Dimensions.get("window");    const height = width * 0.5625;    const opacityInterpolate = this._animation.interpolate({      inputRange: [0, 300],      outputRange: [1, 0],    });    const translateYInterpolate = this._animation.interpolate({      inputRange: [0, 300],      outputRange: [0, screenHeight - height + 40],      extrapolate: "clamp",    });    const scaleInterpolate = this._animation.interpolate({      inputRange: [0, 300],      outputRange: [1, 0.5],      extrapolate: "clamp",    });    const translateXInterpolate = this._animation.interpolate({      inputRange: [0, 300],      outputRange: [0, 85],      extrapolate: "clamp",    });    // const scrollStyles = {    //   opacity: opacityInterpolate,    //   transform: [    //     {    //       translateY: translateYInterpolate,    //     },    //   ],    // };    const videoStyles = {      transform: [        {          translateY: translateYInterpolate,        },        {          translateX: translateXInterpolate,        },        {          scale: scaleInterpolate,        },      ],    };    return (      <View style={styles.container}>        <TouchableOpacity onPress={this.handleOpen}>          <Text>Content Below: Click To Reopen Video</Text>        </TouchableOpacity>        <View style={{backgroundColor:'red',position: "absolute",top: 0, left: 0, right: 0, bottom: 0}} pointerEvents="box-none">          <Animated.View            style={[{ width:400, height:100 }, videoStyles]}            {...this._panResponder.panHandlers}          >            <Video repeat style={{position: "absolute",top: 0, left: 0, right: 0, bottom: 0}} source={Lights} resizeMode="contain" />          </Animated.View>          {/*<Animated.ScrollView style={[styles.scrollView, scrollStyles]}>*/}            {/*<View style={styles.padding}>*/}              {/*<Text style={styles.title}>Beautiful DJ Mixing Lights</Text>*/}              {/*<Text>1M Views</Text>*/}              {/*<View style={styles.likeRow}>*/}                {/*<TouchableIcon name="thumbs-up">10,000</TouchableIcon>*/}                {/*<TouchableIcon name="thumbs-down">3</TouchableIcon>*/}                {/*<TouchableIcon name="share">Share</TouchableIcon>*/}                {/*<TouchableIcon name="download">Save</TouchableIcon>*/}                {/*<TouchableIcon name="plus">Add to</TouchableIcon>*/}              {/*</View>*/}            {/*</View>*/}            {/*<View style={[styles.channelInfo, styles.padding]}>*/}              {/*<Image*/}                {/*source={ChannelIcon}*/}                {/*style={styles.channelIcon}*/}                {/*resizeMode="contain"*/}              {/*/>*/}              {/*<View style={styles.channelText}>*/}                {/*<Text style={styles.channelTitle}>Prerecorded MP3s</Text>*/}                {/*<Text>1M Subscribers</Text>*/}              {/*</View>*/}            {/*</View>*/}            {/*<View style={[styles.playlist, styles.padding]}>*/}              {/*<Text style={styles.playlistUpNext}>Up next</Text>*/}              {/*<PlaylistVideo*/}                {/*image={Thumbnail}*/}                {/*name="Next Sweet DJ Video"*/}                {/*channel="Prerecorded MP3s"*/}                {/*views="380K"*/}              {/*/>*/}              {/*<PlaylistVideo*/}                {/*image={Thumbnail}*/}                {/*name="Next Sweet DJ Video"*/}                {/*channel="Prerecorded MP3s"*/}                {/*views="380K"*/}              {/*/>*/}              {/*<PlaylistVideo*/}                {/*image={Thumbnail}*/}                {/*name="Next Sweet DJ Video"*/}                {/*channel="Prerecorded MP3s"*/}                {/*views="380K"*/}              {/*/>*/}              {/*<PlaylistVideo*/}                {/*image={Thumbnail}*/}                {/*name="Next Sweet DJ Video"*/}                {/*channel="Prerecorded MP3s"*/}                {/*views="380K"*/}              {/*/>*/}              {/*<PlaylistVideo*/}                {/*image={Thumbnail}*/}                {/*name="Next Sweet DJ Video"*/}                {/*channel="Prerecorded MP3s"*/}                {/*views="380K"*/}              {/*/>*/}              {/*<PlaylistVideo*/}                {/*image={Thumbnail}*/}                {/*name="Next Sweet DJ Video"*/}                {/*channel="Prerecorded MP3s"*/}                {/*views="380K"*/}              {/*/>*/}              {/*<PlaylistVideo*/}                {/*image={Thumbnail}*/}                {/*name="Next Sweet DJ Video"*/}                {/*channel="Prerecorded MP3s"*/}                {/*views="380K"*/}              {/*/>*/}            {/*</View>*/}          {/*</Animated.ScrollView>*/}        </View>      </View>    );  }}const styles = StyleSheet.create({  container: {    flex: 1,    alignItems: "center",    justifyContent: "center",  },  scrollView: {    flex: 1,    backgroundColor: "#FFF",  },  title: {    fontSize: 28,  },  likeRow: {    flexDirection: "row",    justifyContent: "space-around",    paddingVertical: 15,  },  touchIcon: {    alignItems: "center",    justifyContent: "center",  },  iconText: {    marginTop: 5,  },  padding: {    paddingVertical: 15,    paddingHorizontal: 15,  },  channelInfo: {    flexDirection: "row",    borderBottomWidth: 1,    borderBottomColor: "#DDD",    borderTopWidth: 1,    borderTopColor: "#DDD",  },  channelIcon: {    width: 50,    height: 50,  },  channelText: {    marginLeft: 15,  },  channelTitle: {    fontSize: 18,    marginBottom: 5,  },  playlistUpNext: {    fontSize: 24,  },  playlistVideo: {    flexDirection: "row",    height: 100,    marginTop: 15,    marginBottom: 15,  },  playlistThumbnail: {    width: null,    height: null,    flex: 1,  },  playlistText: {    flex: 2,    paddingLeft: 15,  },  playlistVideoTitle: {    fontSize: 18,  },  playlistSubText: {    color: "#555",  },});