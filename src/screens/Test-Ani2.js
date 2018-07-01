import React, { Component } from "react";import { Image, ScrollView, Text, View } from "react-native";import { Button } from "react-native-elements";import ModalSpinner from "../components/Common/ModalSpinner";import { firedb, firestore } from "../modules/firebase";import GeoFire from "geofire";class Test extends Component {  constructor(props) {    super(props);    this.state = {      dataLoading: false,      visible: false,      orgsGeoList: [],      orgsDetailList: {},      data: {}    };    this.geoFire = new GeoFire(firedb.ref("orgs"));    this.geoQuery = this.geoFire.query({      center: [0, 0],      radius: 0    });    this.orgsGeoList = [];    this.geoQuery.on("ready", async () => {      /*this.orgsGeoList.map(org => {        firestore          .collection("orgs")          .doc(`${org.key}`)          .get()          .then(doc => temp.push(doc.data()))          .catch(err => console.log("firestore err: ", err));      });*/      let temp = await this.fetchOrgsAndPetsDetail(this.orgsGeoList);      console.log("ready",temp[267][0]);      this.setState({ dataLoading: false, orgsGeoList: this.orgsGeoList, data: temp });      //this.geoQuery.cancel()    });    this.geoQuery.on("key_entered", (key, location, distance) => {      this.setState({ dataLoading: true });      console.log("key_entered", key);      this.orgsGeoList.push({ key, distance });      /*await firestore        .collection("orgs")        .doc(`${key}`)        .get()        .then(doc => this.orgsGeoList.push(doc.data()))        .catch(err=>console.log('firestore err: ',err))      ;*/      //console.log('key_entered: ',firestore.collection('orgs').doc(key).name)    });    this.geoQuery.on("key_exited", key => {      this.setState({ dataLoading: true });      this.orgsGeoList = _.remove(this.orgsGeoList, n => {        return n.key === key;      });    });    /*this.geoQuery.on("key_exited", key => {      this.setState({ dataLoading: true });      delete this.markersHolder[key];    });*/  }  componentDidMount() {    navigator.geolocation.getCurrentPosition(pos => {      const longitude = pos.coords.longitude;      const latitude = pos.coords.latitude;      console.log(longitude, latitude);    });  }  componentDidUpdate(prevProps, prevState) {    //let temp = {};    /*if (this.state.orgsDetailList !== prevState.orgsDetailList) {      this.state.orgsGeoList.map(geo => {        if (this.state.orgsDetailList[geo.key]) {          temp[geo.key] = this.state.orgsDetailList[geo.key];        } else {          temp[geo.key] = firestore            .collection("orgs")            .doc(`${key}`)            .get()            .then(doc => this.orgsGeoList.push(doc.data()))            .catch(err => console.log("firestore err: ", err));        }      });    }*/    //this.setState({ orgsDetailList: temp });  }  /*  fetchOrgByID = id => {    return firestore      .collection("orgs")      .doc(`${id}`)      .get()      .then(doc => doc.data())      .catch(err => console.log("firestore err: ", err));  };*/  updateCriteria = (lat, lng, rad) => {    this.geoQuery.updateCriteria({      center: [lat, lng],      radius: rad    });  };  fetchOrgsAndPetsDetail = geoArray => {    if (!geoArray.length) return {};    let temp = {};    geoArray.map(geo => {      temp[geo.key] = [];      firestore        .collection("pets")        .where("orgID", "==", geo.key)        .get()        .then(querySnapshot => {          querySnapshot.forEach(doc => {            if (doc.exists) {              //console.log("doc found: ", geo.key, doc.id);              temp[geo.key].push(doc.data());            } else {              console.log("no doc: ", geo.key);            }          });        }) //temp.push(doc.data()))        .catch(err => console.log("firestore err: ", err));    });    console.log("temp", temp[267][0].age);    return temp;  };  render() {    console.log("data", this.state.data);    return (      <View style={{ flex: 1 }}>        {this.state.dataLoading && (          <ModalSpinner visible={this.state.dataLoading} transparent={true} animationType={"none"} setLoadingFalse={this.setLoadingFalse} />        )}        <ScrollView style={{ top: 50, flex: 1 }}>          <View>            <Text>Organizations found: {this.state.orgsGeoList.length}</Text>            <Text>state.data.length: ---- {Object.keys(this.state.data).length}</Text>          </View>          <Button onPress={() => this.updateCriteria(37, -122, 50)} />          {Object.keys(this.state.data).map(orgID => {            if (this.state.data[orgID].length > 0) {              return this.state.data[orgID].map(pet => (                <View style={{backgroundColor:'red',width:200,height:200,margin:10}}>                  <Text>{pet.name}</Text>                  {pet.pictures[0] && <Image style={{width:150,height:150}} source={{uri:pet.pictures[0].thumbnailUrl}}/>}                </View>              ));            }          })}          {/*{Object.keys(this.state.data).map(org=>{            Object.keys(org).map(pet=>console.log(pet.name))          })}*/}          {/*{this.state.orgsGeoList.map(org => {            //let temp = this.fetchOrgByID(org.key);            return (              <Text key={org.key}>                {org.key} -- {org.distance.toFixed(2)}              </Text>            );          })}*/}          <Text />        </ScrollView>      </View>    );  }}const mapStateToProps = state => {  return {    nearbyPets : state.nearbyPets  }}export default connect(mapStateToProps,actions)(Test);