import firebase from "firebase";

// Inspirated
const config = {
  apiKey: "AIzaSyCLHgRAQGs4QIycY0fkHDDLJyZ5RjtvbVM",
  authDomain: "inspirated-c43a7.firebaseapp.com",
  databaseURL: "https://inspirated-c43a7.firebaseio.com",
  projectId: "inspirated-c43a7",
  storageBucket: "inspirated-c43a7.appspot.com",
  messagingSenderId: "1071966757131",
  appId: "1:1071966757131:web:56e39238372c6f70fc820e",
  measurementId: "G-V5E272KSV0"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

db.settings = {
  timestampsInSnapshots: true
};
