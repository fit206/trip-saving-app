import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBGdTrIovOjrG6U6S4MZ3ALj_p3JsfFySM",
  authDomain: "firestore-database-c4e73.firebaseapp.com",
  databaseURL: "https://firestore-database-c4e73-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "firestore-database-c4e73",
  storageBucket: "firestore-database-c4e73.firebasestorage.app",
  messagingSenderId: "692300432464",
  appId: "1:692300432464:web:e5511daf666d48f4a0bd55",
  measurementId: "G-V2RNKCZ77Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const password = document.getElementById('password').value;

        try {
            // Create new user document in Firestore
            await setDoc(doc(db, 'users', userId), {
                password: password,
                savings: 0  // Initial savings set to 0
            });

            alert('Pendaftaran berjaya!');
            window.location.href = 'login.html?type=member';
        } catch (error) {
            console.error('Registration error:', error);
            alert('Ralat semasa pendaftaran. Sila cuba lagi.');
        }
    });
});