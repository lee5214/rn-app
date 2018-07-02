import { combineReducers } from "redux";import auth from "./authReducer";import jobsList from "./jobReducer";import likedPets from "./likesReducer";import { petsByOrg, petsNearby } from "./petsReducer";import orgsDetailList from "./orgsReducer";export default combineReducers({  auth,  jobsList,  likedPets,  petsByOrg,  petsNearby,  orgsDetailList});