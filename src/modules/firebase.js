import firebase from "firebase";import "firebase/firestore";import fireConfig from "../../config/credentials";firebase.initializeApp(fireConfig);let db = firebase.firestore();db.settings({ timestampsInSnapshots: true });export default db;