import React, { Component } from "react";import { connect } from "react-redux";import PropTypes from "prop-types";import * as actions from "../actions";import { Image, ScrollView, Text, View } from "react-native";import { Button } from "react-native-elements";import ModalSpinner from "../components/Common/ModalSpinner";import { firedb, firestore } from "../modules/firebase";import GeoFire from "geofire";class Test extends Component {  constructor(props) {    super(props);    this.state = {      dataLoading: false,      visible: false,      orgsGeoList: [],      orgsDetailList: {},      data: {},      petsNearby: {},      dataFlag: false    };    this.geoFire = new GeoFire(firedb.ref("orgs"));    this.geoQuery = this.geoFire.query({      center: [0, 0],      radius: 0    });    this.orgsGeoList = [];    this.geoQuery.on("ready", () => {      /*this.orgsGeoList.map(org => {        firestore          .collection("orgs")          .doc(`${org.key}`)          .get()          .then(doc => temp.push(doc.data()))          .catch(err => console.log("firestore err: ", err));      });*/      //let temp = this.fetchOrgsAndPetsDetail(this.orgsGeoList);      this.orgsGeoList.map(org => this.props.fetchPetsByOrg(org.key));      //this.props.fetchNearbyPets(this.orgsGeoList);      console.log("ready");      this.setState({ dataLoading: false, orgsGeoList: this.orgsGeoList });      //this.geoQuery.cancel()    });    this.geoQuery.on("key_entered", (key, location, distance) => {      this.setState({ dataLoading: true });      console.log("key_entered", key);      this.orgsGeoList.push({ key, distance });      /*await firestore        .collection("orgs")        .doc(`${key}`)        .get()        .then(doc => this.orgsGeoList.push(doc.data()))        .catch(err=>console.log('firestore err: ',err))      ;*/      //console.log('key_entered: ',firestore.collection('orgs').doc(key).name)    });    this.geoQuery.on("key_exited", key => {      this.setState({ dataLoading: true });      this.orgsGeoList = _.remove(this.orgsGeoList, n => {        return n.key === key;      });    });    /*this.geoQuery.on("key_exited", key => {      this.setState({ dataLoading: true });      delete this.markersHolder[key];    });*/  }  static getDerivedStateFromProps(props, state) {    if (props.petsNearby) {      return { petsNearby: props.petsNearby };    }  }  fetchOrgsAndPetsDetail = geoArray => {    if (!geoArray.length) return {};    let temp = {};    geoArray.map(geo => {      temp[geo.key] = [];      firestore        .collection("pets")        .where("orgID", "==", geo.key)        .get()        .then(querySnapshot => {          querySnapshot.forEach(doc => {            if (doc.exists) {              //console.log("doc found: ", geo.key, doc.id);              temp[geo.key].push(doc.data());            } else {              console.log("no doc: ", geo.key);            }          });        }) //temp.push(doc.data()))        .catch(err => console.log("firestore err: ", err));    });    console.log("temp");    return temp;  };  componentDidMount() {    navigator.geolocation.getCurrentPosition(pos => {      const longitude = pos.coords.longitude;      const latitude = pos.coords.latitude;      console.log(longitude, latitude);    });  }  componentDidUpdate(prevProps, prevState) {    //let temp = {};    /*if (this.state.orgsDetailList !== prevState.orgsDetailList) {      this.state.orgsGeoList.map(geo => {        if (this.state.orgsDetailList[geo.key]) {          temp[geo.key] = this.state.orgsDetailList[geo.key];        } else {          temp[geo.key] = firestore            .collection("orgs")            .doc(`${key}`)            .get()            .then(doc => this.orgsGeoList.push(doc.data()))            .catch(err => console.log("firestore err: ", err));        }      });    }*/    //this.setState({ orgsDetailList: temp });    if (prevProps.petsNearby !== this.props.petsNearby) {      //this.setState({ dataFlag: !this.state.dataFlag });      this.forceUpdate();    }  }  /*  fetchOrgByID = id => {    return firestore      .collection("orgs")      .doc(`${id}`)      .get()      .then(doc => doc.data())      .catch(err => console.log("firestore err: ", err));  };*/  updateCriteria = (lat, lng, rad) => {    this.geoQuery.updateCriteria({      center: [lat, lng],      radius: rad    });  };  render() {    console.log("data", this.state.data);    console.log("state", this.state.petsNearby);    console.log("petsbyorg", this.props.petsByOrg);    return (      <View style={{ flex: 1 }}>        {this.state.dataLoading && (          <ModalSpinner visible={this.state.dataLoading} transparent={true} animationType={"none"} setLoadingFalse={this.setLoadingFalse} />        )}        <ScrollView style={{ top: 50, flex: 1 }}>          <View>            <Text>Organizations found: {this.state.orgsGeoList.length}</Text>            <Text>state.pets.length: ---- {Object.keys(this.state.petsNearby).length}</Text>            <View style={{ flex: 1 }}>              {Object.keys(this.state.petsNearby).map(i => (                <Text style={{ height: 50, backgroundColor: "red", margin: 10 }}>{this.state.petsNearby[i].name}</Text>              ))}            </View>          </View>          <Button onPress={() => this.updateCriteria(37, -122, 50)} />          {this.props.petsByOrg.list &&            Object.keys(this.props.petsByOrg.list).map(orgID => <Test2 key={orgID} t={"abc"} data={this.props.petsByOrg.list[orgID]} />)}          {/*{this.props.petsByOrg.list && Object.keys(this.props.petsByOrg.list).map(orgID => {          this.props.petsByOrg.list[orgID].map(pet=>{            <Text>{this.props.petsByOrg.list[orgID][pet].name}</Text>          })        })}*/}          {/*{Object.keys(this.state.data).map(orgID => {*/}          {/*if (this.state.data[orgID].length > 0) {*/}          {/*return this.state.data[orgID].map(pet => (*/}          {/*<View style={{ backgroundColor: "red", width: 200, height: 200, margin: 10 }}>*/}          {/*<Text>{pet.name}</Text>*/}          {/*/!*{pet.pictures[0] && <Image style={{width:150,height:150}} source={{uri:pet.pictures[0].thumbnailUrl}}/>}*!/*/}          {/*</View>*/}          {/*));*/}          {/*}*/}          {/*})}*/}          <Text />        </ScrollView>      </View>    );  }}Test.propTypes = {  petsNearby: PropTypes.object};Test.defaultProps = {  petsNearby: {}};const mapStateToProps = state => {  return {    petsNearby: state.petsNearby,    petsByOrg: state.petsByOrg  };};class Test2 extends Component {  render() {    console.log(this.props.t);    return (      <View>        {this.props.data &&          Object.keys(this.props.data).map(pet => (            <View>              <Text key={pet}>{this.props.data[pet].name}</Text>              {this.props.data[pet].pictures[0] && (                <Image style={{ height: 100, width: 200 }} source={{ uri: this.props.data[pet].pictures[0].thumbnailUrl }} />              )}            </View>          ))}      </View>    );  }}export default connect(mapStateToProps, actions)(Test);