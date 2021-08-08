import firebase from "firebase/app"
import "firebase/firestore"

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
    apiKey: "AIzaSyBhF9s8f3V28NGl0wZp7iisEpC6CbUwT-M",
    authDomain: "twitter-clone-fcb2b.firebaseapp.com",
    projectId: "twitter-clone-fcb2b",
    storageBucket: "twitter-clone-fcb2b.appspot.com",
    messagingSenderId: "856288304369",
    appId: "1:856288304369:web:0f4f5d53db86960ea71d50"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore()

export default db
