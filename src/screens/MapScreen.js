import React, { Component } from "react";import PropTypes from "prop-types";import { connect } from "react-redux";import { Animated, Dimensions, Easing, Image, PanResponder, ScrollView, StyleSheet, Text, View } from "react-native";import { BlurView } from "expo";import * as actions from "../actions";import Icon from "react-native-vector-icons/MaterialIcons";import GeoFire from "geofire";import { firedb } from "../modules/firebase";import MapContainer from "../components/Map/MapContainer";import { defaultRegion } from "../../config/setting/defaultValues";import ModalContainer from "../components/Map/ModalContainer";import SearchArea from "../components/Map/SearchArea";import Carousel, { Pagination } from "react-native-snap-carousel";let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");SCREEN_HEIGHT -= 78;const INTRO_CAROUSEL_HEIGHT = 160;const TAB_HEIGHT = 50;const PROFILE_MIN_Y = 240;const PROFILE_MAX_Y = SCREEN_HEIGHT - PROFILE_MIN_Y;const PROFILE_INTRO_OFFSET = PROFILE_MIN_Y - INTRO_CAROUSEL_HEIGHT;const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);class MapScreen extends Component {  // noinspection JSUnusedGlobalSymbols 1  static navigationOptions = {    title: "Map",    header: null,    tabBarIcon: ({ tintColor }) => {      return <Icon name="place" color={tintColor} size={20} type="materialicons" />;    },    drawerLabel: "MapScreen"  };  constructor(props) {    super(props);    this.state = {      region: defaultRegion,      radius: 10,      dataLoading: false,      orgsSearchedID: [],      petsForCarousel: [], //DEFAULT_SAMPLE, //[]      focusedOrgID: -1,      focusedIntroImageIndex: 0,      focusedProfileImageIndex: 0,      //these two only contain geo locations from firedb      geoMarkersCurrentSearchResults: {},      geoMarkersAllSearchResultsSaved: {},      //animations      anime_bottomUIShowUpValue: new Animated.Value(0),      anime_profileSwipeValue: new Animated.Value(300),      anime_profileAfterSwipeValue: new Animated.Value(0),      isScrollEnabled: false    };    this.scrollOffset = 0;    this.anime_bottomUIShowUpValue = Animated.timing(this.state.anime_bottomUIShowUpValue, {      toValue: 300,      easing: Easing.linear    });    this._panResponder = PanResponder.create({      onMoveShouldSetPanResponder: (evt, gestureState) => {        const { dx, dy, vx, vy, y0 } = gestureState;        if (          (this.state.isScrollEnabled &&            this.scrollOffset <= 0 &&            gestureState.dy > 10 &&            Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 4) ||          (!this.state.isScrollEnabled &&            gestureState.dy <= 0 &&            Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 2)        ) {          console.log("onMoveShouldSet");          return true;        }        return false;      },      onPanResponderGrant: (evt, gestureState) => {        //if (gestureState.y0 > PROFILE_MAX_Y) {        this.state.anime_profileSwipeValue.extractOffset();        //}        //console.log("Responder Grant--", this.state.anime_profileSwipeValue);        //this.state.anime_profileSwipeValue.setValue(gestureState.dy)      },      onPanResponderMove: (evt, gestureState) => {        //if(gestureState.y0>PROFILE_MAX_Y||gestureState.y0<PROFILE_MIN_Y) {        //console.log("Responder Move--", this.state.anime_profileSwipeValue, gestureState);        // if (        //   (!this.state.isScrollEnabled && gestureState.moveY > PROFILE_MAX_Y) ||        //   (this.state.isScrollEnabled && gestureState.moveY < PROFILE_MIN_Y)        // ) {        this.state.anime_profileSwipeValue.setValue(gestureState.dy);        // }        //}        // Animated.event([        //   null,        //   {        //     dy: this.state.anime_profileSwipeValue        //   }        // ])      },      onPanResponderRelease: (evt, gestureState) => {        this.state.anime_profileSwipeValue.flattenOffset();        const { dy, vy, y0, moveY } = gestureState;        if (moveY > PROFILE_MAX_Y + 100) {          this.setState({ isScrollEnabled: false });          console.log("1");          Animated.timing(this.state.anime_profileSwipeValue, {            toValue: 300,            tension: 1          }).start();        } else if (moveY < PROFILE_MIN_Y) {          this.setState({ isScrollEnabled: true });          console.log("2");          Animated.timing(this.state.anime_profileSwipeValue, {            toValue: 0,            duration: 1000,            tension: 1          }).start();        } else if (dy <= 0) {          this.setState({ isScrollEnabled: true });          console.log("3");          Animated.parallel([            Animated.timing(this.state.anime_profileSwipeValue, {              toValue: 0,              tension: 1            }).start(),            Animated.timing(this.state.anime_profileAfterSwipeValue, {              toValue: 300,              duration: 500,              delay: 500            }).start()          ]);          //this.state.anime_profileSwipeValue.setValue(-PROFILE_MAX_Y)        } else if (dy > 0) {          this.setState({ isScrollEnabled: false });          console.log("4");          Animated.parallel([            Animated.timing(this.state.anime_profileSwipeValue, {              toValue: 300,              tension: 1            }).start(),            Animated.timing(this.state.anime_profileAfterSwipeValue, {              toValue: 0            }).start()          ]);        }      }    });    this.markersHolder = {};    this.geoFire = new GeoFire(firedb.ref("orgs"));    this.geoQuery = this.geoFire.query({      center: [this.state.region.latitude, this.state.region.longitude],      radius: 10    });    this.geoQuery.on("ready", async () => {      this.setState({        geoMarkersCurrentSearchResults: this.markersHolder,        geoMarkersAllSearchResultsSaved: {          ...this.state.geoMarkersAllSearchResultsSaved,          ...this.markersHolder        },        dataLoading: false      });    });    this.geoQuery.on("key_entered", (key, location, distance) => {      this.setState({ dataLoading: true });      this.markersHolder[key] = { key, location, distance };    });    this.geoQuery.on("key_exited", key => {      this.setState({ dataLoading: true });      delete this.markersHolder[key];    });  }  _start_anime_bottomUIShowUpValue = () => {    this.anime_bottomUIShowUpValue.start(this.state.anime_bottomUIShowUpValue.setValue(0));  };  componentDidMount() {    navigator.geolocation.getCurrentPosition(pos => {      const longitude = pos.coords.longitude;      const latitude = pos.coords.latitude;      this.setState({ region: { ...this.state.region, latitude, longitude } });    });  }  static getDerivedStateFromProps(props, state) {    if (props.orgsDetailList.newAdded && state.orgsSearchedID.indexOf(props.orgsDetailList.newAdded) < 0) {      return {        orgsSearchedID: [props.orgsDetailList.newAdded, ...state.orgsSearchedID]      };    }    if (props.petsByOrg.list[state.focusedOrgID]) {      let dataObj = props.petsByOrg.list[state.focusedOrgID];      let tempArr = Object.keys(dataObj).map(petID => dataObj[petID]);      return { petsForCarousel: tempArr };    }    // if (state.focusedIntroImageIndex && state.petsForCarousel &&    // state.petsForCarousel[state.focusedIntroImageIndex]) {    //   console.log("derive", state.focusedIntroImageIndex);    //   return {    //     //focusedPetPics: state.petsForCarousel[state.focusedIntroImageIndex].pictures,    //     focusedPet: state.petsForCarousel[state.focusedIntroImageIndex]    //   };    // }    // if (this.state.focusedOrgID && props.petsByOrg[this.state.focusedOrgID]!==this.state.petsForCarousel){    //   return {petsForCarousel:props.petsByOrg[this.state.focusedOrgID]}    // }    return null;  }  radiusFitScreen = (longitudeDelta, latitude) => {    let zoom = Math.round(Math.log(360 / longitudeDelta) / Math.LN2);    let sPerPx = 10 * 156543.03392 * Math.cos(latitude * Math.PI / 180) / Math.pow(2, zoom);    this.setState({ radius: sPerPx });  };  updateRegionInScreen = region => {    if (this.timerForMap) {      clearTimeout(this.timerForMap);    }    this.timerForMap = setTimeout(() => {      this.setState({ region });    }, 100);  };  onSearchArea = (lat, lng, rad) => {    this.updateCriteria(lat, lng, rad);  };  updateCriteria = (lat, lng, rad) => {    this.geoQuery.updateCriteria({      center: [lat, lng],      radius: rad    });  };  setLoadingFalse = () => {    this.setState({ dataLoading: false });  };  //for org  onPanItemPress = id => {    this.markAnimateToCoord(this.state.geoMarkersAllSearchResultsSaved[id]);    this.props.navigation.navigate("mapDetail", {      //TODO rewrite      focusedOrg: this.props.orgsDetailList.list[id]    });  };  markAnimateToCoord = markerData => {    let coordinate = {      latitude: markerData.location[0],      longitude: markerData.location[1]    };    this.mapContainer.map.animateToCoordinate(coordinate, 500);  };  onMapMarkPress = markerKey => {    this.setState({ focusedOrgID: markerKey, petsForCarousel: [] });    this._start_anime_bottomUIShowUpValue();    this.props.fetchOrgDetail(markerKey);    this.props.fetchPetsByOrg(markerKey);  };  // setFocusedPetIndex = id => {  //   this.setState({ focusedIntroImageIndex: id });  // };  render() {    const introFade = this.state.anime_profileSwipeValue.interpolate({      inputRange: [0, 200, 300],      outputRange: [0, 0, 1],      extrapolate: "clamp"    });    const introTransX = this.state.anime_profileSwipeValue.interpolate({      inputRange: [0, 300],      outputRange: [150, 0],      extrapolate: "clamp"    });    const profileFade = this.state.anime_profileSwipeValue.interpolate({      inputRange: [0, 200, 300],      outputRange: [1, 0, 0],      extrapolate: "clamp"    });    const profileScale = this.state.anime_profileSwipeValue.interpolate({      inputRange: [0, 300],      outputRange: [1, 0.6],      extrapolate: "clamp"    });    const miniProfileTransY = this.state.anime_profileSwipeValue.interpolate({      inputRange: [0, 300],      outputRange: [-PROFILE_MAX_Y, 0],      extrapolate: "clamp"    });    const introCarouselTransY = this.state.anime_bottomUIShowUpValue.interpolate({      inputRange: [0, 300],      outputRange: [INTRO_CAROUSEL_HEIGHT, 0],      extrapolate: "clamp"    });    const profileShowUpValue = this.state.anime_bottomUIShowUpValue.interpolate({      inputRange: [0, 300],      outputRange: [SCREEN_HEIGHT, PROFILE_MAX_Y]      //outputRange: [-300, 0]    });    const blurBackgroundMap = this.state.anime_profileSwipeValue.interpolate({      inputRange: [0, 300],      outputRange: [300, 0],      extrapolate: "clamp"    });    const blurProfileTitle = this.state.anime_profileAfterSwipeValue.interpolate({      inputRange: [0, 150, 300],      outputRange: [0, 80, 80],      extrapolate: "clamp"    });    const profileDelayFadeIn = this.state.anime_profileAfterSwipeValue.interpolate({      inputRange: [0, 300],      outputRange: [0, 1],      extrapolate: "clamp"    });    const profileContentMoveUp = this.state.anime_profileAfterSwipeValue.interpolate({      inputRange: [0, 300],      outputRange: [SCREEN_HEIGHT, 0],      extrapolate: "clamp"    });    const profileDelayMoveLeft = this.state.anime_profileAfterSwipeValue.interpolate({      inputRange: [0, 300],      outputRange: [0, -SCREEN_WIDTH],      extrapolate: "clamp"    });    const introCarouselSwipUpValue = this.state.anime_bottomUIShowUpValue.interpolate({      inputRange: [0, 300],      outputRange: [SCREEN_HEIGHT, PROFILE_MAX_Y + 100]      //outputRange: [-300, 0]    });    const { orgsDetailList, petsByOrg } = this.props;    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;    const focusedOrg = orgsDetailList.list[this.state.focusedOrgID];    let focusedPet = this.state.petsForCarousel[this.state.focusedIntroImageIndex] || [];    return (      <View style={{ flex: 1 }}>        <Image source={{ uri: "../assets/bg1.png" }} />        {/*<View          style={{            width: "100%",            height: 2,            backgroundColor: "gray",            position: "absolute",            zIndex: 999,            top: PROFILE_MAX_Y          }}        />*/}        <ModalContainer visible={this.state.dataLoading} setLoadingFalse={this.setLoadingFalse} />        <MapContainer          ref={ref => (this.mapContainer = ref)}          dataLoading={this.state.dataLoading}          geoMarkersCurrentSearchResults={this.state.geoMarkersCurrentSearchResults}          updateRegionInScreen={this.updateRegionInScreen}          onRegionChangeComplete={this.onRegionChangeComplete}          radius={this.state.radius}          orgsDetailList={this.props.orgsDetailList}          navigation={this.props.navigation}          onMapMarkPress={this.onMapMarkPress}        />        <SearchArea          leftOffset={SCREEN_WIDTH}          topOffset={PROFILE_MAX_Y}          setR10={() => this.setState({ radius: 10 })}          setR50={() => this.setState({ radius: 50 })}          radius={this.state.radius}          onSearchArea={() => this.onSearchArea(latitude, longitude, this.state.radius)}        />        <AnimatedBlurView          tint="default"          intensity={blurBackgroundMap}          style={[StyleSheet.absoluteFill, { display: this.state.isScrollEnabled ? "flex" : "none" }]}        />        {/*burger button*/}        <View style={{ position: "absolute", top: 40, flexDirection: "row" }}>          <Icon            style={{ position: "absolute", right: 25 }}            name="menu"            color={"white"}            size={30}            type="materialicons"            onPress={() => {              this.props.navigation.navigate("DrawerOpen");            }}          />          <View style={{ flexGrow: 1 }}>            <Text style={{ textAlign: "center", color: "white" }}>              LatLng:{latitude.toFixed(2)}|{longitude.toFixed(2)}            </Text>            <Text style={{ textAlign: "center", color: "white" }}>              Delta:{latitudeDelta.toFixed(2)}|{longitudeDelta.toFixed(2)}            </Text>          </View>        </View>        <Animated.View          style={{            position: "absolute",            left: 0,            right: 0,            zIndex: 10,            top: profileShowUpValue,            height: SCREEN_HEIGHT, //PROFILE_MIN_Y,            backgroundColor: "#66CCCC",            transform: [{ translateY: miniProfileTransY }]          }}          {...this._panResponder.panHandlers}        >          <ScrollView            scrollEnabled={this.state.isScrollEnabled}            scrollEventThrottle={16}            //contentContainerStyle={{padding:21}}            onScroll={event => {              this.scrollOffset = event.nativeEvent.contentOffset.y;            }}          >            {/* intro */}            <View style={{ flex: 1 }}>              {focusedPet && (                <Animated.View                  style={{                    opacity: introFade,                    transform: [{ translateX: introTransX }]                  }}                >                  {focusedOrg && (                    <Animated.Text                      style={{                        color: "white",                        marginHorizontal: 10,                        marginTop: 10,                        fontSize: 16,                        fontWeight: "500"                      }}                    >                      {focusedOrg.name}                    </Animated.Text>                  )}                  <Animated.Text                    style={{                      color: "white",                      marginHorizontal: 10,                      marginTop: 10,                      fontSize: 22,                      fontWeight: "600"                    }}                  >                    {focusedPet.name}                  </Animated.Text>                </Animated.View>              )}              <Animated.View                style={{                  opacity: profileFade,                  //marginTop: 44,                  transform: [{ scale: profileScale }]                }}              >                <View                  style={{                    zIndex: 20,                    height: 400,                    marginTop: -PROFILE_INTRO_OFFSET,                    shadowColor: 'black',                    shadowOffset: {                      width: 0,                      height: 3                    },                    shadowRadius: 5,                    shadowOpacity: 0.8                  }}                >                  <Carousel                    ref={ref => (this._carouselProfile = ref)}                    data={focusedPet.pictures || []}                    renderItem={this.renderProfileItem}                    sliderWidth={SCREEN_WIDTH} //carousel width                    itemWidth={SCREEN_WIDTH}                    lockScrollWhileSnapping                    showsHorizontalScrollIndicator                    onScroll={() =>                      this.setState({                        focusedProfileImageIndex: this._carouselProfile.currentIndex                      })                    }                  />                  <Animated.View                    style={{                      zIndex: 999,                      position: "absolute",                      bottom: 0,                      width: SCREEN_WIDTH,                      opacity: profileDelayFadeIn                      //marginLeft: SCREEN_WIDTH,                      //transform: [{ translateX: profileDelayMoveLeft }]                    }}                  >                    <AnimatedBlurView tint="dark" intensity={200} style={[StyleSheet.absoluteFill]} />                    <Text                      style={{                        color: "white",                        textAlign: "center",                        fontSize: 32,                        paddingTop: 10,                        fontWeight: "500"                      }}                    >                      {focusedPet.name}                    </Text>                    <Pagination                      activeDotIndex={this.state.focusedProfileImageIndex}                      dotsLength={focusedPet.pictures ? focusedPet.pictures.length : 0}                      //containerStyle={{backgroundColor:'gray',borderRadius:25,width:300}}                      dotColor={"white"}                      inactiveDotColor={"white"}                      dotStyle={{                        width: 30,                        height: 3,                        borderRadius: 5                        //backgroundColor: "white"                      }}                      inactiveDotStyle={{                        width: 10,                        height: 10                        //backgroundColor: "white"                      }}                      containerStyle={{                        paddingVertical: 5                      }}                    />                  </Animated.View>                </View>              </Animated.View>            </View>            <Animated.View              style={{                marginBottom: INTRO_CAROUSEL_HEIGHT,                margin: 10,                padding: 20,                borderRadius: 10,                borderWidth: 1,                borderColor: "white",                //backgroundColor:'black',                //backgroundColor: "rgb(23,32,112)",                height: 1000,                //width: SCREEN_WIDTH,                //marginTop: SCREEN_HEIGHT-700,                transform: [{ translateY: profileContentMoveUp }]              }}            >              <Animated.View style={{ flex: 1, flexDirection: "column" }}>                <View>                  <Text style={{ color: "gray", fontSize: 12, fontWeight: "600" }}>Age </Text>                  <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>{focusedPet.age}</Text>                </View>                <Text style={{ fontSize: 20, color: "white" }}>                  <Text>Breed:</Text>                  <Text style={{ fontSize: 14, textAlign: "right" }}>{focusedPet.breed}</Text>                </Text>                <Text style={{color:'white'}}>Size: {focusedPet.size}</Text>                <Text style={{color:'white'}}>Species: {focusedPet.species}</Text>                <Text style={{color:'white'}}>{focusedPet.descriptionPlain}</Text>              </Animated.View>            </Animated.View>          </ScrollView>        </Animated.View>        <Animated.View          style={{            position: "absolute",            zIndex: 21,            bottom: 0,            height: INTRO_CAROUSEL_HEIGHT,            transform: [{ translateY: introCarouselTransY }]            //backgroundColor:'red'          }}        >          <Carousel            ref={ref => (this._carousel = ref)}            data={this.state.petsForCarousel}            renderItem={this.renderIntroItem}            sliderWidth={SCREEN_WIDTH} //carousel width            itemWidth={SCREEN_WIDTH * 0.8}            lockScrollWhileSnapping            showsHorizontalScrollIndicator            inactiveSlideOpacity={1}            slideStyle={{ height: INTRO_CAROUSEL_HEIGHT - 20, marginVertical: 10, backgroundColor: "white" }}            onScroll={() => {              this.setState({ focusedIntroImageIndex: this._carousel.currentIndex });              this._carouselProfile.snapToItem(0); //when focusedPet change, reset profile index            }}          />        </Animated.View>      </View>    );  }  renderProfileItem = ({ item, index }) => {    const { fullsizeUrl } = item;    return (      <View        style={{          flexGrow: 1        }}      >        <Image          source={{ uri: fullsizeUrl }}          style={{            flexGrow: 1,            height: "100%",            width: "100%",            position: "absolute",            top: 0,            left: 0          }}        />      </View>    );  };  renderIntroItem = ({ item, index }) => {    const { name, orgID, pictures } = item;    const fadeInterpolate = this.state.anime_profileSwipeValue.interpolate({      inputRange: [0, 300],      outputRange: [1, 0],      extrapolate: "clamp"    });    return (      <View        style={{          flexGrow: 1        }}      >        <Image          source={{ uri: pictures[0].large.url }}          style={{            flexGrow: 1,            height: "100%",            width: "100%",            position: "absolute",            top: 0,            left: 0          }}        />        {/*<View style={{flexGrow: 1,          marginBottom: 10,          backgroundColor: "red"}}>          <Image            source={{ uri: pictures[0].large.url }}            style={{flexGrow: 1,              height: "100%",              width: "100%",              position: "absolute",              top: 0,              left: 0}}          />          <View style={{ backgroundColor: "black", opacity: 0.6 }}>          <Text style={styles.slideTitle}>{name}</Text>          </View>        </View>*/}        {/* <Card          //containerStyle={{ borderRadius: 15 }}          image={{ uri: pictures[0].large.url }}        >          <Animated.View style={{ opacity: fadeInterpolate }}>            <View>              <Text                style={{                  color: "white",                  fontSize: 20,                  flexDirection: "row",                  justifyContent: "space-between"                }}              >                <Text style={{ flex: 1 }}>{name}</Text>                <Text style={{ flex: 1 }}>{orgID}</Text>              </Text>            </View>          </Animated.View>        </Card>*/}      </View>    );  };}const styles = StyleSheet.create({  container: {    flex: 1    //justifyContent: "center"  },  panContainer: {    flexDirection: "column",    //width: 200,    left: 0, //(SCREEN_WIDTH - 200)/2,    top: 100,    zIndex: 1,    position: "absolute",    backgroundColor: "white"  },  centerPointer: {    flexDirection: "column",    width: 200,    height: 100,    opacity: 1,    backgroundColor: "white",    borderRadius: 25,    zIndex: 10  }});function mapStateToProps(state) {  return {    jobsList: state.jobsList.results,    petsByOrg: state.petsByOrg,    orgsDetailList: state.orgsDetailList  };}MapScreen.propTypes = {  jobsList: PropTypes.array.isRequired};MapScreen.defaultProps = {  jobsList: [],  petsByOrg: {},  orgsDetailList: {    //newAdded:null,    list: {}  }};export default connect(mapStateToProps, actions)(MapScreen);