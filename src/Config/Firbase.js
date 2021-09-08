import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDDbPXSliltLehsZOLE0wxKZeXFMA18wPc",
  authDomain: "internathon-f6cb2.firebaseapp.com",
  projectId: "internathon-f6cb2",
  storageBucket: "internathon-f6cb2.appspot.com",
  messagingSenderId: "112310429720",
  appId: "1:112310429720:web:f0c7f9d53d9ccf40723b6d",
  measurementId: "G-18CJBL7VXV"
};

let firebaseApp=firebase.initializeApp(firebaseConfig);
export let firebaseAuth=firebaseApp.auth();
export let firebaseStorage=firebaseApp.storage();
export let firebaseDB=firebaseApp.firestore();
export let timeStamp = firebase.firestore.FieldValue.serverTimestamp;