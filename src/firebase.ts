import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBYF5FAjOVE_hkGy5qScx_5LLOPBZ5lwbY",
    authDomain: "scheda-54451.firebaseapp.com",
    databaseURL: "https://scheda-54451-default-rtdb.firebaseio.com",
    projectId: "scheda-54451",
    storageBucket: "scheda-54451.firebasestorage.app",
    messagingSenderId: "58315825857",
    appId: "1:58315825857:web:1f9eb202c84dbac58f2a40",
    measurementId: "G-1PG6P9FJNB"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const database = getDatabase(app);
// export const firebaseAnalytics = analytics;