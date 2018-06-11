import React, { Component } from "react";import { connect } from "react-redux";import { Animated, Dimensions, Easing, Image, PanResponder, ScrollView, StyleSheet, Text, View } from "react-native";import { BlurView } from "expo";import * as actions from "../actions";import Icon from "react-native-vector-icons/MaterialIcons";import GeoFire from "geofire";import { firedb } from "../modules/firebase";import MapContainer from "../components/Map/MapContainer";import { defaultRegion } from "../../config/setting/defaultValues";import ModalContainer from "../components/Map/ModalContainer";import SearchArea from "../components/Map/SearchArea";import Carousel, { Pagination } from "react-native-snap-carousel";import PetDetailList from "../components/ProfilePage/PetDetailList";import Spinner from '../components/Common/Spinner';let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");SCREEN_HEIGHT -= 78;const INTRO_CAROUSEL_HEIGHT = 140;const TAB_HEIGHT = 50;const PROFILE_MIN_Y = 230;const PROFILE_MAX_Y = SCREEN_HEIGHT - PROFILE_MIN_Y;const PROFILE_INTRO_OFFSET = PROFILE_MIN_Y - INTRO_CAROUSEL_HEIGHT;const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);const COLORS = ["#000000", "#FF6666", "#666699", "#66CCCC", "#FFCC99", "#009933", "#993366"];const AnimatedIcon = Animated.createAnimatedComponent(Icon);class MapScreen extends Component {  // noinspection JSUnusedGlobalSymbols 1  static navigationOptions = {    title: "Map",    header: null,    tabBarIcon: ({ tintColor }) => {      return <Icon name="place" color={tintColor} size={20} type="materialicons" />;    },    drawerLabel: "MapScreen"  };  constructor(props) {    super(props);    this.state = {      region: defaultRegion,      radius: 10,      dataLoading: true,      orgsSearchedID: [],      petsForCarousel: [], //DEFAULT_SAMPLE, //[]      focusedOrgID: -1,      focusedIntroPetIndex: 0,      focusedIntroPetIndexPrev: 0,      focusedProfileImageIndex: 0,      //these two only contain geo locations from firedb      geoMarkersCurrentSearchResults: {},      //geoMarkersAllSearchResultsSaved: {},      //animations      anime_bottomUIShowUp: new Animated.Value(0),      anime_profileSwipe: new Animated.Value(300),      anime_profileAfterSwipe: new Animated.Value(0),      anime_introSwipe: new Animated.Value(0),      anime_profileScrollDown: new Animated.Value(0),      isScrollEnabled: false,      isMapBlurEnabled: false,      petSwitchFlag: false    };    this.scrollOffset = 0;    this.anime_bottomUIShowUp = Animated.timing(this.state.anime_bottomUIShowUp, {      toValue: 300,      easing: Easing.linear    });    this.anime_introSwipe = Animated.timing(this.state.anime_introSwipe, {      toValue: 300,      easing: Easing.linear    });    this._panResponder = PanResponder.create({      onMoveShouldSetPanResponder: (evt, gestureState) => {        if (          (this.state.isScrollEnabled && this.scrollOffset <= 0 && gestureState.dy > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 4) ||          (!this.state.isScrollEnabled && gestureState.dy <= 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 2)        ) {          return true;        }        return false;      },      onPanResponderGrant: (evt, gestureState) => {        this.setState({ isMapBlurEnabled: true });        this.state.anime_profileSwipe.extractOffset();      },      onPanResponderMove: (evt, gestureState) => {        this.state.anime_profileSwipe.setValue(gestureState.dy);      },      onPanResponderRelease: (evt, gestureState) => {        this.state.anime_profileSwipe.flattenOffset();        const { dy, moveY } = gestureState;        if (moveY > PROFILE_MAX_Y + 100) {          this.state.anime_profileAfterSwipe.setValue(0);          this.setState({ isScrollEnabled: false, isMapBlurEnabled: false });          console.log("1");          Animated.timing(this.state.anime_profileSwipe, {            toValue: 300,            tension: 1          }).start();        } else if (moveY < PROFILE_MIN_Y) {          this.setState({ isScrollEnabled: true, isMapBlurEnabled: true });          console.log("2");          Animated.parallel([            Animated.timing(this.state.anime_profileSwipe, {              toValue: 0            }),            Animated.timing(this.state.anime_profileAfterSwipe, {              toValue: 300,              delay: 500            })          ]).start();        } else if (dy <= 0) {          this.setState({ isScrollEnabled: true, isMapBlurEnabled: true });          console.log("3");          Animated.parallel([            Animated.timing(this.state.anime_profileSwipe, {              toValue: 0            }),            Animated.timing(this.state.anime_profileAfterSwipe, {              toValue: 300,              delay: 500            })          ]).start();          //this.state.anime_profileSwipe.setValue(-PROFILE_MAX_Y)        } else if (dy > 0) {          console.log("4");          this.state.anime_profileAfterSwipe.setValue(0);          Animated.parallel([            Animated.timing(this.state.anime_profileSwipe, {              toValue: 300            }),            Animated.timing(this.state.anime_profileAfterSwipe, {              toValue: 0            })          ]).start(this.setState({ isScrollEnabled: false, isMapBlurEnabled: false }));        }      }    });    this.markersHolder = {};    this.geoFire = new GeoFire(firedb.ref("orgs"));    this.geoQuery = this.geoFire.query({      center: [this.state.region.latitude, this.state.region.longitude],      radius: 10    });    this.geoQuery.on("ready", async () => {      console.log("loading false");      this.setState({        geoMarkersCurrentSearchResults: this.markersHolder,        //  geoMarkersAllSearchResultsSaved: {        //   ...this.state.geoMarkersAllSearchResultsSaved,        //   ...this.markersHolder        // },        dataLoading: false      });      // setTimeout(() => {      //   this.setState({ dataLoading: false });      // }, 1000);    });    this.geoQuery.on("key_entered", (key, location, distance) => {      this.setState({ dataLoading: true });      this.markersHolder[key] = { key, location, distance };    });    this.geoQuery.on("key_exited", key => {      this.setState({ dataLoading: true });      delete this.markersHolder[key];    });  }  componentDidMount() {    navigator.geolocation.getCurrentPosition(pos => {      const longitude = pos.coords.longitude;      const latitude = pos.coords.latitude;      this.setState({ region: { ...this.state.region, latitude, longitude } });    });  }  static getDerivedStateFromProps(props, state) {    if (props.orgsDetailList.newAdded && state.orgsSearchedID.indexOf(props.orgsDetailList.newAdded) < 0) {      return {        orgsSearchedID: [props.orgsDetailList.newAdded, ...state.orgsSearchedID]      };    }    if (props.petsByOrg.list[state.focusedOrgID]) {      let dataObj = props.petsByOrg.list[state.focusedOrgID];      let tempArr = Object.keys(dataObj).map(petID => dataObj[petID]);      return { petsForCarousel: tempArr };    }    return null;  }  componentDidUpdate(prevProps, prevState, snapshot) {    if (this.state.focusedIntroPetIndex !== prevState.focusedIntroPetIndex) {      this.setState({ focusedIntroPetIndexPrev: prevState.focusedIntroPetIndex });      this.anime_introSwipe.start(this.state.anime_introSwipe.setValue(0));    }  }  radiusFitScreen = (longitudeDelta, latitude) => {    let zoom = Math.round(Math.log(360 / longitudeDelta) / Math.LN2);    let sPerPx = 10 * 156543.03392 * Math.cos(latitude * Math.PI / 180) / Math.pow(2, zoom);    this.setState({ radius: sPerPx });  };  updateRegionInScreen = region => {    if (this.timerForMap) {      clearTimeout(this.timerForMap);    }    this.timerForMap = setTimeout(() => {      this.setState({ region });    }, 100);  };  onSearchArea = (lat, lng, rad) => {    this.updateCriteria(lat, lng, rad);  };  updateCriteria = (lat, lng, rad) => {    this.geoQuery.updateCriteria({      center: [lat, lng],      radius: rad    });  };  setLoadingFalse = () => {    this.setState({ dataLoading: false });  };  markAnimateToCoord = markerData => {    let coordinate = {      latitude: markerData.location[0],      longitude: markerData.location[1]    };    this.mapContainer.map.animateToCoordinate(coordinate, 500);  };  onMapMarkPress = markerKey => {    this.setState({ focusedOrgID: markerKey, petsForCarousel: [] });    this.anime_bottomUIShowUp.start(this.state.anime_bottomUIShowUp.setValue(0));    this.props.fetchOrgDetail(markerKey);    this.props.fetchPetsByOrg(markerKey);  };  // setFocusedPetIndex = id => {  //   this.setState({ focusedIntroPetIndex: id });  // };  profileIconToggle = () => {    if (this.state.isScrollEnabled === false) {      this.setState({ isScrollEnabled: true, isMapBlurEnabled: true });      console.log("3");      Animated.parallel([        Animated.timing(this.state.anime_profileSwipe, {          toValue: 0,          tension: 1        }),        Animated.timing(this.state.anime_profileAfterSwipe, {          toValue: 300,          duration: 500,          delay: 500        })      ]).start();    } else {      this.state.anime_profileAfterSwipe.setValue(0);      this._profileSV.scrollTo({ y: 0 });      Animated.parallel([        Animated.timing(this.state.anime_profileSwipe, {          toValue: 300,          tension: 1        }),        Animated.timing(this.state.anime_profileAfterSwipe, {          toValue: 0        })      ]).start(this.setState({ isScrollEnabled: false, isMapBlurEnabled: false }));    }  };  render() {    const introTextScroll = this.state.anime_introSwipe.interpolate({      inputRange: [0, 150, 300],      outputRange: [0, -120, 0],      extrapolate: "clamp"    });    const introFade = this.state.anime_profileSwipe.interpolate({      inputRange: [0, 200, 300],      outputRange: [0, 0, 1],      extrapolate: "clamp"    });    const introTransX = this.state.anime_profileSwipe.interpolate({      inputRange: [0, 300],      outputRange: [150, 0],      extrapolate: "clamp"    });    const profileFade = this.state.anime_profileSwipe.interpolate({      inputRange: [0, 200, 300],      outputRange: [1, 0, 0],      extrapolate: "clamp"    });    const profileScale = this.state.anime_profileSwipe.interpolate({      inputRange: [0, 300],      outputRange: [1, 0.4],      extrapolate: "clamp"    });    const introProfileTransY = this.state.anime_profileSwipe.interpolate({      inputRange: [0, 300],      outputRange: [-PROFILE_MAX_Y, 0],      extrapolate: "clamp"    });    const iconRotate = this.state.anime_profileSwipe.interpolate({      inputRange: [0, 300],      outputRange: ["-180deg", "0deg"],      extrapolate: "clamp"    });    const introCarouselTransY = this.state.anime_bottomUIShowUp.interpolate({      inputRange: [0, 300],      outputRange: [INTRO_CAROUSEL_HEIGHT, 0],      extrapolate: "clamp"    });    const profileListBounceX = this.state.anime_introSwipe.interpolate({      inputRange: [0, 150, 300],      outputRange: [0, SCREEN_WIDTH, 0],      extrapolate: "clamp"    });    const profileListColorChange = this.state.anime_introSwipe.interpolate({      inputRange: [0, 300],      //outputRange:[COLORS[1],COLORS[2]],      outputRange: [COLORS[this.state.focusedIntroPetIndexPrev % COLORS.length], COLORS[this.state.focusedIntroPetIndex % COLORS.length]],      extrapolate: "clamp"    });    const profileShowUpValue = this.state.anime_bottomUIShowUp.interpolate({      inputRange: [0, 300],      outputRange: [SCREEN_HEIGHT, PROFILE_MAX_Y]      //outputRange: [-300, 0]    });    const blurBackgroundMap = this.state.anime_profileSwipe.interpolate({      inputRange: [0, 300],      outputRange: [140, 0],      extrapolate: "clamp"    });    const profileDelayFadeIn = this.state.anime_profileAfterSwipe.interpolate({      inputRange: [0, 300],      outputRange: [0, 1],      extrapolate: "clamp"    });    const switchIconTranY = this.state.anime_profileSwipe.interpolate({      inputRange: [0, 300],      outputRange: [-50, 0],      extrapolate: "clamp"    });    const openNav = this.state.anime_profileAfterSwipe.interpolate({      inputRange: [0, 300],      outputRange: ["0deg", "10deg"],      extrapolate: "clamp"    });    const { orgsDetailList, petsByOrg } = this.props;    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;    let focusedOrg = orgsDetailList.list[this.state.focusedOrgID] || {};    let focusedPet = this.state.petsForCarousel[this.state.focusedIntroPetIndex] || {};    return (      <View style={{ flex: 1 }}>        {this.state.dataLoading && <ModalContainer visible={this.state.dataLoading} transparent={true} animationType={"none"} setLoadingFalse={this.setLoadingFalse} />}        <MapContainer          ref={ref => (this.mapContainer = ref)}          geoMarkersCurrentSearchResults={this.state.geoMarkersCurrentSearchResults}          updateRegionInScreen={this.updateRegionInScreen}          onRegionChangeComplete={this.onRegionChangeComplete}          radius={this.state.radius}          orgsDetailList={this.props.orgsDetailList}          navigation={this.props.navigation}          onMapMarkPress={this.onMapMarkPress}        />        <SearchArea          leftOffset={SCREEN_WIDTH}          topOffset={PROFILE_MAX_Y}          setR10={() => this.setState({ radius: 10 })}          setR20={() => this.setState({ radius: 20 })}          radius={this.state.radius}          onSearchArea={() => this.onSearchArea(latitude, longitude, this.state.radius)}        />        <AnimatedBlurView tint="default" intensity={blurBackgroundMap} style={[StyleSheet.absoluteFill, { display: this.state.isMapBlurEnabled ? "flex" : "none" }]} />        {/*burger button*/}        <View style={{ position: "absolute", top: 40, flexDirection: "row" }}>          <Icon            style={{ position: "absolute", right: 25 }}            name="menu"            color={"white"}            size={30}            type="materialicons"            onPress={() => {              this.props.navigation.navigate("DrawerOpen");            }}          />          <View style={{ flexGrow: 1 }}>            <Text style={{ textAlign: "center", color: "white" }}>              LatLng:{latitude.toFixed(2)}|{longitude.toFixed(2)}            </Text>            <Text style={{ textAlign: "center", color: "white" }}>              Delta:{latitudeDelta.toFixed(2)}|{longitudeDelta.toFixed(2)}            </Text>          </View>        </View>        <Animated.View          style={{            position: "absolute",            left: 0,            right: 0,            zIndex: 10,            top: profileShowUpValue,            height: SCREEN_HEIGHT, //PROFILE_MIN_Y,            backgroundColor: profileListColorChange, //COLORS[this.state.focusedIntroPetIndex % COLORS.length],            transform: [{ translateY: introProfileTransY }]          }}          {...this._panResponder.panHandlers}        >          <AnimatedIcon            style={[styles.swipeIcon, { transform: [{ rotate: iconRotate }, { translateY: switchIconTranY }] }]}            name="keyboard-arrow-up"            color={"white"}            size={30}            type="materialicons"            onPress={this.profileIconToggle}          />          <ScrollView            ref={ref => (this._profileSV = ref)}            scrollEnabled={this.state.isScrollEnabled}            scrollEventThrottle={16}            //contentContainerStyle={{padding:21}}            onScroll={event => {              this.scrollOffset = event.nativeEvent.contentOffset.y;            }}          >            {/* intro */}            <View style={{ flex: 1 }}>              <Animated.View                style={{                  opacity: introFade,                  transform: [{ translateX: introTransX }]                }}              >                <View                  style={{                    marginTop: 10                  }}                >                  {focusedOrg && (                    <Animated.Text                      ellipsizeMode={"head"}                      numberOfLine={1}                      style={{                        flex:1,                        color: "white",                        width:SCREEN_WIDTH-50,                        marginHorizontal: 10,                        top:5,                        //marginTop: 10,                        fontSize: 16,                        fontWeight: "600"                      }}                    >                      {focusedOrg.name}                    </Animated.Text>                  )}                  {focusedPet && (                    <Animated.Text                      numberOfLine={1}                      style={{                        //position:'absolute',                        //top:35,                        color: "white",                        marginHorizontal: 10,                        fontSize: 22,                        fontWeight: "800",                        transform: [{ translateX: introTextScroll }]                      }}                    >                      {focusedPet.name}                    </Animated.Text>                  )}                </View>              </Animated.View>            </View>            <Animated.View style={[styles.profileImageContainer, { transform: [{ scale: profileScale }], opacity: profileFade }]}>              {/*Profile*/}              <Carousel                ref={ref => (this._carouselProfile = ref)}                data={focusedPet.pictures || []}                renderItem={this.renderProfileItem}                sliderWidth={SCREEN_WIDTH} //carousel width                itemWidth={SCREEN_WIDTH * 0.9}                hasParallaxImages={true}                lockScrollWhileSnapping                inactiveSlideScale={1}                onScroll={() =>                  this.setState({                    focusedProfileImageIndex: this._carouselProfile.currentIndex                  })                }              />              <Animated.View style={[styles.profileTitleContainer, { opacity: profileDelayFadeIn }]}>                <AnimatedBlurView tint="default" intensity={100} style={[StyleSheet.absoluteFill]} />                <Text                  style={{                    color: "white",                    textAlign: "left",                    paddingTop: 0,                    fontSize: 24,                    fontWeight: "600"                  }}                >                  {focusedPet.name}                </Text>              </Animated.View>            </Animated.View>            <Pagination              activeDotIndex={this.state.focusedProfileImageIndex}              dotsLength={focusedPet.pictures ? focusedPet.pictures.length : 0}              //containerStyle={{backgroundColor:'gray',borderRadius:25,width:300}}              dotColor={"white"}              inactiveDotColor={"white"}              dotStyle={{                width: 20,                height: 3,                borderRadius: 5              }}              inactiveDotStyle={{                width: 10,                height: 10              }}              containerStyle={{                marginVertical: 10              }}            />            <Animated.View              style={{                marginBottom: INTRO_CAROUSEL_HEIGHT,                marginHorizontal: SCREEN_WIDTH * 0.1,                marginVertical: 0,                //padding: 20,                shadowColor: "black",                shadowOpacity: 0.1,                shadowOffset: {                  width: 0,                  height: 1                },                //overflow: "hidden",                //borderWidth:1,                borderColor: "rgb(80,40,40)"                //backgroundColor: "rgb(50,50,50)"                //backgroundColor: "rgb(23,32,112)",                //width: SCREEN_WIDTH,                //marginTop: SCREEN_HEIGHT-700,                //transform:[{translateY:profileListBounceY}]              }}            >              <Animated.View style={{ flex: 1}}>                <PetDetailList petObj={focusedPet} flag={this.state.petSwitchFlag} themeColor={COLORS[this.state.focusedIntroPetIndex % COLORS.length]} />              </Animated.View>            </Animated.View>          </ScrollView>        </Animated.View>        <Animated.View          style={{            position: "absolute",            zIndex: 21,            bottom: 0,            height: INTRO_CAROUSEL_HEIGHT,            transform: [{ translateY: introCarouselTransY }]          }}        >          {this.state.petsForCarousel.length ? (            <Carousel              type={"tinder"}              ref={ref => (this._carouselIntro = ref)}              data={this.state.petsForCarousel}              renderItem={this.renderIntroItem}              sliderWidth={SCREEN_WIDTH} //carousel width              itemWidth={150} //{SCREEN_WIDTH * 0.5}              lockScrollWhileSnapping              showsHorizontalScrollIndicator              //hasParallaxImages={true}              inactiveSlideOpacity={1}              inactiveSlideScale={0.9}              slideStyle={{                height: INTRO_CAROUSEL_HEIGHT,                //backgroundColor: "black",                //padding:2                //opacity:this.state.isScrollEnabled?.8:1              }}              containerCustomStyle={{                height: INTRO_CAROUSEL_HEIGHT              }}              //containerCustomStyle={{}}              onBeforeSnapToItem={() => {                this.setState({ petSwitchFlag: !this.state.petSwitchFlag });              }}              onScroll={() => {                this.setState({ focusedIntroPetIndex: this._carouselIntro.currentIndex });                this._carouselProfile.snapToItem(0); //when focusedPet change, reset profile index              }}            />          ):<Spinner size={"large"} color={"#000000"} />}        </Animated.View>      </View>    );  }  renderProfileItem = ({ item, index }) => {    const { fullsizeUrl } = item;    return (      <View        style={{          flexGrow: 1        }}      >        <Image          source={{ uri: fullsizeUrl }}          style={{            flexGrow: 1,            height: "100%",            width: "100%",            position: "absolute"          }}        />      </View>    );  };  renderIntroItem = ({ item, index }, parallaxProps) => {    const { name, orgID, pictures } = item;    const fadeInterpolate = this.state.anime_profileSwipe.interpolate({      inputRange: [0, 300],      outputRange: [1, 0],      extrapolate: "clamp"    });    return (      <View        style={{          flexGrow: 1        }}      >        <Image          source={{ uri: pictures[0].large.url }}          style={{            flexGrow: 1,            height: "100%",            width: "100%",            position: "absolute",            top: 0,            left: 0          }}          parallaxFactor={0.4}          {...parallaxProps}        />      </View>    );  };}const styles = StyleSheet.create({  swipeIcon: {    borderColor: "white",    borderWidth: 1,    height: 40,    width: 40,    padding: 5,    position: "absolute",    right: 10,    top: (PROFILE_INTRO_OFFSET - 40) / 2,    zIndex: 30  },  profileImageContainer: {    zIndex: 20,    height: 250,    //marginTop: -PROFILE_INTRO_OFFSET, //profileMarginTop,    shadowColor: "black",    shadowOffset: {      width: 0,      height: 20    },    shadowRadius: 10,    shadowOpacity: 0.1    //transform:[{perspective:1000},{rotateX:'-45deg'},{translateY:0}],    //width:SCREEN_WIDTH*.8,    //overflow:'hidden',    //left:SCREEN_WIDTH*.1  },  profileTitleContainer: {    zIndex: 999,    //marginLeft:SCREEN_WIDTH*.5,    position: "absolute",    paddingVertical: 5,    paddingHorizontal: 15,    bottom: 5,    alignSelf: "center"    //width: SCREEN_WIDTH * .5,    //left: SCREEN_WIDTH * 0.1,    //marginLeft: SCREEN_WIDTH,    //transform: [{ translateX: profileDelayMoveLeft }]  }});function mapStateToProps(state) {  return {    petsByOrg: state.petsByOrg,    orgsDetailList: state.orgsDetailList  };}MapScreen.propTypes = {};MapScreen.defaultProps = {  petsByOrg: {},  orgsDetailList: {    //newAdded:null,    list: {}  }};export default connect(mapStateToProps, actions)(MapScreen);